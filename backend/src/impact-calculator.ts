import { DeviceType, EnvironmentalImpact, EstimateImpactRequest } from './types';

/**
 * AI Environmental Impact Calculator
 * Uses rule-based emission factors for hackathon MVP
 * In production: Replace with ML model or third-party API
 */

// Emission factors (kg CO2 per device)
const EMISSION_FACTORS: Record<DeviceType, number> = {
  Laptop: 280,
  Phone: 70,
  TV: 400,
};

// Toxic materials weight percentage by device type
const TOXIC_MATERIALS_PERCENTAGE: Record<DeviceType, number> = {
  Laptop: 0.15,  // 15% of device weight is toxic materials
  Phone: 0.12,   // 12%
  TV: 0.20,      // 20%
};

// Transport emission factor (kg CO2 per km per kg of cargo)
const TRANSPORT_EMISSION_FACTOR = 0.0001;

/**
 * Calculate projected environmental impact
 * Called when device is registered
 */
export function calculateProjectedImpact(
  deviceType: DeviceType,
  weight: number,
  transportDistance: number
): Omit<EnvironmentalImpact, 'deviceId'> {
  
  // Base CO2 saved from recycling vs landfill
  const baseCO2Saved = EMISSION_FACTORS[deviceType];
  
  // Adjust for actual device weight (emission factors assume average weight)
  const averageWeights: Record<DeviceType, number> = {
    Laptop: 2.5,
    Phone: 0.2,
    TV: 15,
  };
  
  const weightMultiplier = weight / averageWeights[deviceType];
  const adjustedCO2Saved = baseCO2Saved * weightMultiplier;
  
  // Subtract transport emissions
  const transportEmissions = weight * transportDistance * TRANSPORT_EMISSION_FACTOR;
  const netCO2Saved = Math.max(0, adjustedCO2Saved - transportEmissions);
  
  // Calculate toxic waste prevented
  const toxicWastePrevented = weight * TOXIC_MATERIALS_PERCENTAGE[deviceType];
  
  // Calculate sustainability score (0-100)
  const sustainabilityScore = calculateSustainabilityScore(
    netCO2Saved,
    toxicWastePrevented,
    transportDistance
  );
  
  return {
    co2Saved: parseFloat(netCO2Saved.toFixed(2)),
    toxicWastePrevented: parseFloat(toxicWastePrevented.toFixed(2)),
    sustainabilityScore,
    impactType: 'projected',
  };
}

/**
 * Calculate verified environmental impact
 * Called when device status changes to "Recycled"
 */
export function calculateVerifiedImpact(
  deviceType: DeviceType,
  weight: number,
  transportDistance: number
): Omit<EnvironmentalImpact, 'deviceId'> {
  
  // For MVP, verified impact uses same calculation as projected
  // In production: This would incorporate actual recycling facility data
  const impact = calculateProjectedImpact(deviceType, weight, transportDistance);
  
  return {
    ...impact,
    impactType: 'verified',
  };
}

/**
 * Calculate sustainability score (0-100)
 * Higher score = better environmental outcome
 */
function calculateSustainabilityScore(
  co2Saved: number,
  toxicWastePrevented: number,
  transportDistance: number
): number {
  
  // Base score from CO2 saved (0-60 points)
  let score = 0;
  
  if (co2Saved > 0) {
    // Normalize CO2 saved to 0-60 range
    // Assuming max reasonable CO2 saved is 500kg for large devices
    score += Math.min(60, (co2Saved / 500) * 60);
  }
  
  // Add points for toxic waste prevention (0-25 points)
  // Assuming max reasonable toxic waste is 5kg
  score += Math.min(25, (toxicWastePrevented / 5) * 25);
  
  // Deduct points for long transport distance (0-15 points penalty)
  // Penalize distances over 50km
  if (transportDistance > 50) {
    const penalty = Math.min(15, ((transportDistance - 50) / 200) * 15);
    score -= penalty;
  } else {
    // Bonus for short transport
    score += Math.min(15, ((50 - transportDistance) / 50) * 15);
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Estimate transport distance based on location
 * In production: Use Google Maps API or geocoding service
 */
export function estimateTransportDistance(location: string): number {
  // For MVP, use simple heuristics based on location string
  const cityKeywords = ['city', 'downtown', 'urban', 'central'];
  const suburbanKeywords = ['suburb', 'residential', 'neighborhood'];
  const ruralKeywords = ['rural', 'countryside', 'village', 'remote'];
  
  const lowerLocation = location.toLowerCase();
  
  if (cityKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 15; // km - urban areas have closer recycling centers
  } else if (suburbanKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 35; // km - suburban areas
  } else if (ruralKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 80; // km - rural areas farther from facilities
  }
  
  // Default moderate distance
  return 30;
}

/**
 * API endpoint handler for impact estimation
 */
export function estimateImpact(request: EstimateImpactRequest): Omit<EnvironmentalImpact, 'deviceId'> {
  return calculateProjectedImpact(
    request.deviceType,
    request.weight,
    request.transportDistance
  );
}
