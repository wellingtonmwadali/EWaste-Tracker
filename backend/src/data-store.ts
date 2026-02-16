import { DeviceWithMetadata, EnvironmentalImpact, TimelineEvent, DashboardStats } from './types';
import fs from 'fs';
import path from 'path';

/**
 * In-Memory Data Store with File Persistence
 * For hackathon MVP - persists to JSON file
 * In production: Replace with PostgreSQL or MongoDB
 */

const DATA_FILE = path.join(__dirname, '../../data-store.json');

class DataStore {
  // Device metadata (weight, location, transport distance)
  private deviceMetadata: Map<number, {
    weight: number;
    location: string;
    transportDistance: number;
  }> = new Map();
  
  // Projected impact (calculated on registration)
  private projectedImpacts: Map<number, EnvironmentalImpact> = new Map();
  
  // Verified impact (calculated when recycled)
  private verifiedImpacts: Map<number, EnvironmentalImpact> = new Map();
  
  // Device timeline events
  private timelines: Map<number, TimelineEvent[]> = new Map();
  
  constructor() {
    this.loadFromFile();
  }
  
  /**
   * Load data from file on startup
   */
  private loadFromFile(): void {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        
        // Restore maps from JSON
        this.deviceMetadata = new Map(data.deviceMetadata || []);
        this.projectedImpacts = new Map(data.projectedImpacts || []);
        this.verifiedImpacts = new Map(data.verifiedImpacts || []);
        this.timelines = new Map(data.timelines || []);
        
        console.log('✅ Loaded data from persistent storage');
        console.log(`📊 Devices in store: ${this.deviceMetadata.size}`);
      } else {
        console.log('📝 No existing data file, starting fresh');
      }
    } catch (error) {
      console.error('⚠️ Error loading data file:', error);
    }
  }
  
  /**
   * Save data to file
   */
  private saveToFile(): void {
    try {
      const data = {
        deviceMetadata: Array.from(this.deviceMetadata.entries()),
        projectedImpacts: Array.from(this.projectedImpacts.entries()),
        verifiedImpacts: Array.from(this.verifiedImpacts.entries()),
        timelines: Array.from(this.timelines.entries()),
      };
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }
  
  /**
   * Store device metadata
   */
  storeDeviceMetadata(
    deviceId: number,
    weight: number,
    location: string,
    transportDistance: number
  ): void {
    this.deviceMetadata.set(deviceId, {
      weight,
      location,
      transportDistance,
    });
    this.saveToFile();
    console.log(`💾 Saved metadata for device ${deviceId}`);
  }
  
  /**
   * Get device metadata
   */
  getDeviceMetadata(deviceId: number) {
    return this.deviceMetadata.get(deviceId);
  }
  
  /**
   * Store projected impact
   */
  storeProjectedImpact(impact: EnvironmentalImpact): void {
    this.projectedImpacts.set(impact.deviceId, impact);
    this.saveToFile();
  }
  
  /**
   * Get projected impact
   */
  getProjectedImpact(deviceId: number): EnvironmentalImpact | undefined {
    return this.projectedImpacts.get(deviceId);
  }
  
  /**
   * Store verified impact
   */
  storeVerifiedImpact(impact: EnvironmentalImpact): void {
    this.verifiedImpacts.set(impact.deviceId, impact);
    this.saveToFile();
  }
  
  /**
   * Get verified impact
   */
  getVerifiedImpact(deviceId: number): EnvironmentalImpact | undefined {
    return this.verifiedImpacts.get(deviceId);
  }
  
  /**
   * Add timeline event
   */
  addTimelineEvent(deviceId: number, event: TimelineEvent): void {
    const timeline = this.timelines.get(deviceId) || [];
    timeline.push(event);
    this.timelines.set(deviceId, timeline);
    this.saveToFile();
  }
  
  /**
   * Get device timeline
   */
  getTimeline(deviceId: number): TimelineEvent[] {
    return this.timelines.get(deviceId) || [];
  }
  
  /**
   * Calculate dashboard statistics
   */
  getDashboardStats(devices: any[]): DashboardStats {
    let totalCO2Saved = 0;
    let totalToxicWastePrevented = 0;
    let totalSustainabilityScore = 0;
    let recycledCount = 0;
    
    const devicesByStatus = {
      disposed: 0,
      collected: 0,
      recycled: 0,
    };
    
    devices.forEach((device) => {
      // Count by status
      const status = device.status.toLowerCase();
      if (status === 'disposed') devicesByStatus.disposed++;
      else if (status === 'collected') devicesByStatus.collected++;
      else if (status === 'recycled') {
        devicesByStatus.recycled++;
        recycledCount++;
      }
      
      // Sum up verified impacts (only for recycled devices)
      if (status === 'recycled') {
        const verifiedImpact = this.verifiedImpacts.get(device.id);
        if (verifiedImpact) {
          totalCO2Saved += verifiedImpact.co2Saved;
          totalToxicWastePrevented += verifiedImpact.toxicWastePrevented;
          totalSustainabilityScore += verifiedImpact.sustainabilityScore;
        }
      }
    });
    
    const averageSustainabilityScore = recycledCount > 0
      ? Math.round(totalSustainabilityScore / recycledCount)
      : 0;
    
    return {
      totalDevices: devices.length,
      totalCO2Saved: parseFloat(totalCO2Saved.toFixed(2)),
      totalToxicWastePrevented: parseFloat(totalToxicWastePrevented.toFixed(2)),
      averageSustainabilityScore,
      devicesByStatus,
    };
  }
  
  /**
   * Get all device IDs
   */
  getAllDeviceIds(): number[] {
    return Array.from(this.deviceMetadata.keys());
  }
  
  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.deviceMetadata.clear();
    this.projectedImpacts.clear();
    this.verifiedImpacts.clear();
    this.timelines.clear();
  }
}

// Singleton instance
export const dataStore = new DataStore();
