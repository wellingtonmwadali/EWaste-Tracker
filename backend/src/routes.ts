import express, { Request, Response } from 'express';
import { blockchainService } from './blockchain-service';
import { dataStore } from './data-store';
import {
  calculateProjectedImpact,
  calculateVerifiedImpact,
  estimateTransportDistance,
  estimateImpact,
} from './impact-calculator';
import {
  RegisterDeviceRequest,
  UpdateStatusRequest,
  EstimateImpactRequest,
  DeviceWithMetadata,
} from './types';

const router = express.Router();

/**
 * POST /api/register-device
 * Register new e-waste device
 */
router.post('/register-device', async (req: Request, res: Response) => {
  try {
    const { deviceType, weight, location }: RegisterDeviceRequest = req.body;
    
    // Validation
    if (!deviceType || !weight || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: deviceType, weight, location',
      });
    }
    
    if (!['Laptop', 'Phone', 'TV'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deviceType. Must be: Laptop, Phone, or TV',
      });
    }
    
    if (weight <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be greater than 0',
      });
    }
    
    // Estimate transport distance based on location
    const transportDistance = estimateTransportDistance(location);
    
    // Register device on blockchain
    const { deviceId, txHash } = await blockchainService.registerDevice(deviceType);
    
    // Store metadata in data store
    dataStore.storeDeviceMetadata(deviceId, weight, location, transportDistance);
    
    // Calculate projected impact
    const projectedImpact = {
      deviceId,
      ...calculateProjectedImpact(deviceType as any, weight, transportDistance),
    };
    dataStore.storeProjectedImpact(projectedImpact);
    
    // Add initial timeline event
    dataStore.addTimelineEvent(deviceId, {
      status: 'Disposed',
      timestamp: Date.now(),
      transactionHash: txHash,
    });
    
    console.log(`✅ Device ${deviceId} registered successfully`);
    
    res.json({
      success: true,
      deviceId,
      transactionHash: txHash,
      projectedImpact,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /register-device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register device',
      details: error.message,
    });
  }
});

/**
 * POST /api/update-status
 * Update device lifecycle status
 */
router.post('/update-status', async (req: Request, res: Response) => {
  try {
    const { deviceId, newStatus }: UpdateStatusRequest = req.body;
    
    // Validation
    if (!deviceId || !newStatus) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: deviceId, newStatus',
      });
    }
    
    if (!['Collected', 'Recycled'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: Collected or Recycled',
      });
    }
    
    // Get device metadata
    const metadata = dataStore.getDeviceMetadata(deviceId);
    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Device not found in metadata store',
      });
    }
    
    // Update status on blockchain
    const txHash = await blockchainService.updateDeviceStatus(deviceId, newStatus);
    
    // Add timeline event
    dataStore.addTimelineEvent(deviceId, {
      status: newStatus as any,
      timestamp: Date.now(),
      transactionHash: txHash,
    });
    
    // If recycled, calculate verified impact
    let verifiedImpact;
    if (newStatus === 'Recycled') {
      const device = await blockchainService.getDevice(deviceId);
      verifiedImpact = {
        deviceId,
        ...calculateVerifiedImpact(
          device.deviceType as any,
          metadata.weight,
          metadata.transportDistance
        ),
      };
      dataStore.storeVerifiedImpact(verifiedImpact);
      
      console.log(`🎉 Device ${deviceId} recycled! Impact verified.`);
    }
    
    res.json({
      success: true,
      deviceId,
      newStatus,
      transactionHash: txHash,
      verifiedImpact,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /update-status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
      details: error.message,
    });
  }
});

/**
 * GET /api/device/:id
 * Get device details with impact data
 */
router.get('/device/:id', async (req: Request, res: Response) => {
  try {
    const deviceId = parseInt(req.params.id);
    
    if (isNaN(deviceId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid device ID',
      });
    }
    
    // Get device from blockchain
    const device = await blockchainService.getDevice(deviceId);
    console.log(`✅ Fetched device ${deviceId} from blockchain:`, device);
    
    // Get metadata
    const metadata = dataStore.getDeviceMetadata(deviceId);
    console.log(`📊 Fetched metadata for device ${deviceId}:`, metadata);
    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Device metadata not found, but blockchain data is available',
        device: device, // Return blockchain data anyway
      });
    }
    
    // Combine device with metadata
    const deviceWithMetadata: DeviceWithMetadata = {
      ...device,
      ...metadata,
    };
    
    // Get impacts
    const projectedImpact = dataStore.getProjectedImpact(deviceId);
    const verifiedImpact = dataStore.getVerifiedImpact(deviceId);
    
    // Get timeline
    const timeline = dataStore.getTimeline(deviceId);
    
    res.json({
      success: true,
      device: deviceWithMetadata,
      projectedImpact,
      verifiedImpact,
      timeline,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /device/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device',
      details: error.message,
    });
  }
});

/**
 * POST /api/estimate-impact
 * Estimate environmental impact without registration
 */
router.post('/estimate-impact', (req: Request, res: Response) => {
  try {
    const { deviceType, weight, transportDistance }: EstimateImpactRequest = req.body;
    
    // Validation
    if (!deviceType || !weight || transportDistance === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: deviceType, weight, transportDistance',
      });
    }
    
    if (!['Laptop', 'Phone', 'TV'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deviceType. Must be: Laptop, Phone, or TV',
      });
    }
    
    const impact = estimateImpact({ deviceType, weight, transportDistance });
    
    res.json({
      success: true,
      impact,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /estimate-impact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to estimate impact',
      details: error.message,
    });
  }
});

/**
 * GET /api/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Get total devices from blockchain
    const totalDevices = await blockchainService.getTotalDevices();
    
    // Get all devices
    const devices = [];
    for (let i = 1; i <= totalDevices; i++) {
      try {
        const device = await blockchainService.getDevice(i);
        devices.push(device);
      } catch (error) {
        console.warn(`⚠️ Could not fetch device ${i}`);
      }
    }
    
    // Calculate stats
    const stats = dataStore.getDashboardStats(devices);
    
    res.json({
      success: true,
      stats,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      details: error.message,
    });
  }
});

/**
 * GET /api/devices
 * Get all devices with metadata
 */
router.get('/devices', async (req: Request, res: Response) => {
  try {
    // Get total devices from blockchain
    const totalDevices = await blockchainService.getTotalDevices();
    
    // Get all devices with metadata
    const devices = [];
    for (let i = 1; i <= totalDevices; i++) {
      try {
        const device = await blockchainService.getDevice(i);
        const metadata = dataStore.getDeviceMetadata(i);
        
        if (metadata) {
          devices.push({
            ...device,
            ...metadata,
          });
        } else {
          devices.push(device);
        }
      } catch (error) {
        console.warn(`⚠️ Could not fetch device ${i}`);
      }
    }
    
    res.json({
      success: true,
      devices,
      total: totalDevices,
    });
    
  } catch (error: any) {
    console.error('❌ Error in /devices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices',
      details: error.message,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const balance = await blockchainService.getBalance();
    const totalDevices = await blockchainService.getTotalDevices();
    
    res.json({
      success: true,
      status: 'healthy',
      blockchain: {
        connected: true,
        balance: `${balance} MATIC`,
        totalDevices,
      },
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
    });
  }
});

export default router;
