'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiService, Device, EnvironmentalImpact, TimelineEvent, DeviceStatus } from '@/lib/api';
import Timeline from '@/components/Timeline';
import Confetti from '@/components/Confetti';

export default function DevicePage() {
  const params = useParams();
  const deviceId = params.id as string;

  const [device, setDevice] = useState<Device | null>(null);
  const [projectedImpact, setProjectedImpact] = useState<EnvironmentalImpact | null>(null);
  const [verifiedImpact, setVerifiedImpact] = useState<EnvironmentalImpact | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchDevice();
  }, [deviceId]);

  const fetchDevice = async () => {
    try {
      const response = await apiService.getDevice(parseInt(deviceId));
      if (response.success) {
        setDevice(response.device);
        setProjectedImpact(response.projectedImpact);
        setVerifiedImpact(response.verifiedImpact);
        setTimeline(response.timeline);
      } else {
        setError(response.error || 'Failed to fetch device');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch device');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: DeviceStatus) => {
    setUpdating(true);
    setError('');

    try {
      const response = await apiService.updateStatus({
        deviceId: parseInt(deviceId),
        newStatus,
      });

      if (response.success) {
        // Trigger confetti if recycled
        if (newStatus === 'Recycled') {
          setShowConfetti(true);
        }
        // Refresh device data
        await fetchDevice();
      } else {
        setError(response.error || 'Failed to update status');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Loading device...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Device Not Found</h2>
          <p className="text-dark-400">{error || 'This device does not exist'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 py-12">
      <Confetti show={showConfetti} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                {device.deviceType} #{device.id}
              </h1>
              <p className="text-dark-400 mt-1">
                Registered on {new Date(device.registeredAt * 1000).toLocaleDateString()}
              </p>
            </div>
            <div className={`
              px-4 py-2 rounded-full font-semibold
              ${device.status === 'Disposed' ? 'bg-red-500/10 text-red-400' : ''}
              ${device.status === 'Collected' ? 'bg-yellow-500/10 text-yellow-400' : ''}
              ${device.status === 'Recycled' ? 'bg-primary-500/10 text-primary-400' : ''}
            `}>
              {device.status}
            </div>
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-4">
              <div className="text-sm text-dark-400 mb-1">Weight</div>
              <div className="text-lg font-semibold">{device.weight} kg</div>
            </div>
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-4">
              <div className="text-sm text-dark-400 mb-1">Location</div>
              <div className="text-lg font-semibold">{device.location}</div>
            </div>
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-4">
              <div className="text-sm text-dark-400 mb-1">Transport</div>
              <div className="text-lg font-semibold">{device.transportDistance} km</div>
            </div>
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-4">
              <div className="text-sm text-dark-400 mb-1">Type</div>
              <div className="text-lg font-semibold">{device.deviceType}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Timeline */}
          <div className="card">
            <Timeline timeline={timeline} currentStatus={device.status} />

            {/* Status Update Buttons */}
            <div className="mt-8 pt-6 border-t border-dark-800">
              <h4 className="text-sm font-semibold mb-3">Update Status</h4>
              <div className="space-y-2">
                {device.status === 'Disposed' && (
                  <button
                    onClick={() => handleStatusUpdate('Collected')}
                    disabled={updating}
                    className="w-full btn-secondary disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Mark as Collected 📦'}
                  </button>
                )}
                {device.status === 'Collected' && (
                  <button
                    onClick={() => handleStatusUpdate('Recycled')}
                    disabled={updating}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Mark as Recycled ♻️'}
                  </button>
                )}
                {device.status === 'Recycled' && (
                  <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <div className="text-primary-400 font-semibold">
                      Fully Recycled!
                    </div>
                    <div className="text-sm text-dark-400 mt-1">
                      Environmental impact verified
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Impact */}
          <div className="space-y-6">
            {/* Projected Impact */}
            {projectedImpact && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Projected Impact</h3>
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">
                    Estimated
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400">CO₂ Saved</span>
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div className="text-3xl font-bold text-primary-400">
                      {projectedImpact.co2Saved} kg
                    </div>
                    <div className="text-xs text-dark-500 mt-1">
                      Equivalent to {Math.round(projectedImpact.co2Saved / 0.4)} miles not driven
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400">Toxic Waste Prevented</span>
                      <span className="text-2xl">☠️</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-400">
                      {projectedImpact.toxicWastePrevented} kg
                    </div>
                    <div className="text-xs text-dark-500 mt-1">
                      Heavy metals and hazardous materials
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-400">Sustainability Score</span>
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="flex items-baseline">
                      <div className="text-3xl font-bold text-primary-400">
                        {projectedImpact.sustainabilityScore}
                      </div>
                      <div className="text-dark-500 ml-2">/ 100</div>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${projectedImpact.sustainabilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-dark-400 mt-4 text-center">
                  Impact will be verified when device is fully recycled
                </p>
              </div>
            )}

            {/* Verified Impact */}
            {verifiedImpact && (
              <div className="card border-primary-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-primary-400">Verified Impact</h3>
                  <span className="text-xs bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full">
                    ✓ Confirmed
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-300">CO₂ Saved</span>
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-primary-400">
                      {verifiedImpact.co2Saved} kg
                    </div>
                  </div>

                  <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-300">Toxic Waste Prevented</span>
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-primary-400">
                      {verifiedImpact.toxicWastePrevented} kg
                    </div>
                  </div>

                  <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-dark-300">Final Score</span>
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="text-3xl font-bold text-primary-400">
                      {verifiedImpact.sustainabilityScore} / 100
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
