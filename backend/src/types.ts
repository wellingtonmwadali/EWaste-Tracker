/**
 * Core types for EWaste Tracker Backend
 */

// Device lifecycle status options
export type DeviceStatus = 'Disposed' | 'Collected' | 'Recycled';

// Supported device types
export type DeviceType = 'Laptop' | 'Phone' | 'TV';

// Device structure (matches smart contract)
export interface Device {
  id: number;
  deviceType: DeviceType;
  status: DeviceStatus;
  registeredBy: string;
  registeredAt: number;
  lastUpdated: number;
}

// Extended device with off-chain metadata
export interface DeviceWithMetadata extends Device {
  weight: number;          // in kg
  location: string;        // pickup location
  transportDistance: number; // estimated km to recycling center
}

// Environmental impact calculation result
export interface EnvironmentalImpact {
  deviceId: number;
  co2Saved: number;              // kg CO2
  toxicWastePrevented: number;   // kg
  sustainabilityScore: number;   // 0-100
  impactType: 'projected' | 'verified';
}

// API Request types
export interface RegisterDeviceRequest {
  deviceType: DeviceType;
  weight: number;
  location: string;
}

export interface UpdateStatusRequest {
  deviceId: number;
  newStatus: DeviceStatus;
}

export interface EstimateImpactRequest {
  deviceType: DeviceType;
  weight: number;
  transportDistance: number;
}

// API Response types
export interface RegisterDeviceResponse {
  success: boolean;
  deviceId: number;
  transactionHash: string;
  projectedImpact: EnvironmentalImpact;
}

export interface UpdateStatusResponse {
  success: boolean;
  deviceId: number;
  newStatus: DeviceStatus;
  transactionHash: string;
  verifiedImpact?: EnvironmentalImpact; // Only if status is "Recycled"
}

export interface DeviceDetailsResponse {
  device: DeviceWithMetadata;
  projectedImpact: EnvironmentalImpact;
  verifiedImpact?: EnvironmentalImpact; // Only if recycled
  timeline: TimelineEvent[];
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

// Timeline event for device history
export interface TimelineEvent {
  status: DeviceStatus;
  timestamp: number;
  transactionHash?: string;
}

// Error response
export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}
