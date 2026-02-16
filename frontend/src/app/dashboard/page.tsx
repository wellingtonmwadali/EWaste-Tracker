'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiService, DashboardStats, Device } from '@/lib/api';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // Refresh stats every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, devicesResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getAllDevices(),
      ]);
      
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      } else {
        setError(statsResponse.error || 'Failed to fetch stats');
      }
      
      if (devicesResponse.success) {
        setDevices(devicesResponse.devices);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-dark-400 mb-6">{error || 'Register your first device to see stats'}</p>
          <Link href="/register" className="btn-primary">
            Register Device
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Environmental Impact Dashboard
          </h1>
          <p className="text-xl text-dark-300">
            Real-time aggregate impact across all tracked devices
          </p>
          
          {/* Info Banner */}
          {stats.devicesByStatus.recycled === 0 && stats.totalDevices > 0 && (
            <div className="mt-6 max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 text-yellow-400">
                <span className="text-2xl">💡</span>
                <div className="text-left text-sm">
                  <strong>Tip:</strong> Environmental impact appears when devices reach "Recycled" status.
                  Click on a device below and update its status: Disposed → Collected → Recycled
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Total Devices */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-300">Total Devices</h3>
              <span className="text-4xl">📱</span>
            </div>
            <div className="text-5xl font-bold text-white mb-2">
              <AnimatedCounter value={stats.totalDevices} />
            </div>
            <p className="text-sm text-dark-400">Tracked on blockchain</p>
          </div>

          {/* CO2 Saved */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-300">CO₂ Saved</h3>
              <span className="text-4xl">🌱</span>
            </div>
            <div className="text-5xl font-bold text-primary-400 mb-2">
              <AnimatedCounter value={stats.totalCO2Saved} decimals={1} suffix=" kg" />
            </div>
            <p className="text-sm text-dark-400">
              ≈ {Math.round(stats.totalCO2Saved / 0.4).toLocaleString()} miles not driven
            </p>
          </div>

          {/* Toxic Waste */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-300">Toxic Waste Prevented</h3>
              <span className="text-4xl">☠️</span>
            </div>
            <div className="text-5xl font-bold text-orange-400 mb-2">
              <AnimatedCounter value={stats.totalToxicWastePrevented} decimals={1} suffix=" kg" />
            </div>
            <p className="text-sm text-dark-400">Heavy metals & hazardous materials</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Sustainability Score */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Average Sustainability Score</h3>
              <span className="text-3xl">📊</span>
            </div>
            <div className="flex items-baseline mb-4">
              <div className="text-5xl font-bold text-primary-400">
                <AnimatedCounter value={stats.averageSustainabilityScore} />
              </div>
              <div className="text-2xl text-dark-500 ml-2">/ 100</div>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-primary-600 to-primary-400 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${stats.averageSustainabilityScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-dark-400 mt-3">
              Based on {stats.devicesByStatus.recycled} recycled devices
            </p>
          </div>

          {/* Device Status Breakdown */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Device Status Breakdown</h3>
            <div className="space-y-4">
              {/* Disposed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🗑️</span>
                    <span className="text-dark-300">Disposed</span>
                  </div>
                  <span className="font-semibold">{stats.devicesByStatus.disposed}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.devicesByStatus.disposed / stats.totalDevices) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Collected */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📦</span>
                    <span className="text-dark-300">Collected</span>
                  </div>
                  <span className="font-semibold">{stats.devicesByStatus.collected}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.devicesByStatus.collected / stats.totalDevices) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Recycled */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">♻️</span>
                    <span className="text-dark-300">Recycled</span>
                  </div>
                  <span className="font-semibold text-primary-400">
                    {stats.devicesByStatus.recycled}
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stats.devicesByStatus.recycled / stats.totalDevices) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Comparison */}
        <div className="card mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">Environmental Impact Equivalents</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🚗</div>
              <div className="text-2xl font-bold text-primary-400 mb-1">
                {Math.round(stats.totalCO2Saved / 0.4).toLocaleString()}
              </div>
              <div className="text-sm text-dark-400">Miles not driven</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌳</div>
              <div className="text-2xl font-bold text-primary-400 mb-1">
                {Math.round(stats.totalCO2Saved / 21).toLocaleString()}
              </div>
              <div className="text-sm text-dark-400">Trees planted equivalent</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <div className="text-2xl font-bold text-primary-400 mb-1">
                {Math.round(stats.totalCO2Saved * 2.2).toLocaleString()}
              </div>
              <div className="text-sm text-dark-400">kWh saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏠</div>
              <div className="text-2xl font-bold text-primary-400 mb-1">
                {Math.round(stats.totalCO2Saved / 100).toLocaleString()}
              </div>
              <div className="text-sm text-dark-400">Homes powered for a day</div>
            </div>
          </div>
        </div>

        {/* Devices List */}
        {devices.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Registered Devices</h3>
              <div className="text-sm text-dark-400">
                Click on a device to view details and update status
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <Link
                  key={device.id}
                  href={`/device/${device.id}`}
                  className="card hover:border-primary-500 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {device.deviceType === 'Laptop' ? '💻' : 
                           device.deviceType === 'Phone' ? '📱' : '📺'}
                        </span>
                        <h4 className="font-semibold text-lg">
                          {device.deviceType} #{device.id}
                        </h4>
                      </div>
                      <p className="text-xs text-dark-400">
                        {new Date(device.registeredAt * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${device.status === 'Disposed' ? 'bg-red-500/10 text-red-400' : ''}
                      ${device.status === 'Collected' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                      ${device.status === 'Recycled' ? 'bg-primary-500/10 text-primary-400' : ''}
                    `}>
                      {device.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-dark-400 text-xs">Weight</div>
                      <div className="font-semibold">{device.weight} kg</div>
                    </div>
                    <div>
                      <div className="text-dark-400 text-xs">Location</div>
                      <div className="font-semibold truncate">{device.location}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between text-xs">
                    <span className="text-dark-400">
                      {device.status === 'Recycled' ? '✅ Impact Verified' : 
                       device.status === 'Collected' ? '📦 Ready to Recycle' : 
                       '🗑️ Awaiting Collection'}
                    </span>
                    <span className="text-primary-500 font-semibold">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold mb-3">Make an Impact Today</h3>
            <p className="text-primary-100 mb-6">
              Every device recycled contributes to a cleaner, sustainable future
            </p>
            <Link
              href="/register"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg inline-block transition-all"
            >
              Register Your Device
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
