import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export type DeviceType = 'Laptop' | 'Phone' | 'TV';
export type DeviceStatus = 'Disposed' | 'Collected' | 'Recycled';

export interface RegisterDeviceData {
  deviceType: DeviceType;
  weight: number;
  location: string;
}

export interface UpdateStatusData {
  deviceId: number;
  newStatus: DeviceStatus;
}

export interface EnvironmentalImpact {
  deviceId?: number;
  co2Saved: number;
  toxicWastePrevented: number;
  sustainabilityScore: number;
  impactType: 'projected' | 'verified';
}

export interface Device {
  id: number;
  deviceType: DeviceType;
  status: DeviceStatus;
  registeredBy: string;
  registeredAt: number;
  lastUpdated: number;
  weight: number;
  location: string;
  transportDistance: number;
}

export interface TimelineEvent {
  status: DeviceStatus;
  timestamp: number;
  transactionHash?: string;
}

export interface DashboardStats {
  totalDevices: number;
  totalCO2Saved: number;
  totalToxicWastePrevented: number;
  averageSustainabilityScore: number;
  devicesByStatus: {
    disposed: number;
    collected: number;
    recycled: number;
  };
}

// API functions
export const apiService = {
  // Register new device
  async registerDevice(data: RegisterDeviceData) {
    const response = await api.post('/register-device', data);
    return response.data;
  },

  // Update device status
  async updateStatus(data: UpdateStatusData) {
    const response = await api.post('/update-status', data);
    return response.data;
  },

  // Get device details
  async getDevice(deviceId: number) {
    const response = await api.get(`/device/${deviceId}`);
    return response.data;
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<{ success: boolean; stats: DashboardStats }> {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Get all devices
  async getAllDevices(): Promise<{ success: boolean; devices: Device[]; total: number }> {
    const response = await api.get('/devices');
    return response.data;
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
