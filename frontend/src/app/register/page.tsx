'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, DeviceType } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    deviceType: 'Laptop' as DeviceType,
    weight: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.registerDevice({
        deviceType: formData.deviceType,
        weight: parseFloat(formData.weight),
        location: formData.location,
      });

      if (response.success) {
        // Redirect to device page
        router.push(`/device/${response.deviceId}`);
      } else {
        setError(response.error || 'Failed to register device');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Register E-Waste Device</h1>
          <p className="text-xl text-dark-300">
            Track your device's environmental impact from disposal to recycling
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Device Type *
              </label>
              <select
                value={formData.deviceType}
                onChange={(e) =>
                  setFormData({ ...formData, deviceType: e.target.value as DeviceType })
                }
                className="input-field"
                required
              >
                <option value="Laptop">💻 Laptop</option>
                <option value="Phone">📱 Phone</option>
                <option value="TV">📺 TV</option>
              </select>
              <p className="text-xs text-dark-400 mt-2">
                Select the type of electronic device you're disposing
              </p>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                placeholder="e.g., 2.5"
                className="input-field"
                required
              />
              <p className="text-xs text-dark-400 mt-2">
                Approximate weight in kilograms (affects impact calculation)
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Pickup Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Downtown Seattle"
                className="input-field"
                required
              />
              <p className="text-xs text-dark-400 mt-2">
                Where the device will be collected (used to estimate transport distance)
              </p>
            </div>

            {/* Example Impacts */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-primary-400">
                Expected Environmental Impact
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs text-dark-400">CO₂ Saved</div>
                  <div className="text-sm font-semibold mt-1">
                    {formData.deviceType === 'Laptop' && '280kg'}
                    {formData.deviceType === 'Phone' && '70kg'}
                    {formData.deviceType === 'TV' && '400kg'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl mb-1">☠️</div>
                  <div className="text-xs text-dark-400">Toxic Waste</div>
                  <div className="text-sm font-semibold mt-1">
                    {formData.deviceType === 'Laptop' && '0.4kg'}
                    {formData.deviceType === 'Phone' && '0.02kg'}
                    {formData.deviceType === 'TV' && '3kg'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs text-dark-400">Score</div>
                  <div className="text-sm font-semibold mt-1">75-95</div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering on blockchain...
                </span>
              ) : (
                'Register Device'
              )}
            </button>

            <p className="text-xs text-center text-dark-400">
              By registering, your device will be tracked on the Polygon Mumbai blockchain
            </p>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-dark-900/50 border border-dark-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-sm font-semibold mb-1">Blockchain Verified</div>
            <div className="text-xs text-dark-400">Immutable lifecycle tracking</div>
          </div>
          <div className="bg-dark-900/50 border border-dark-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-semibold mb-1">AI Calculated</div>
            <div className="text-xs text-dark-400">Real environmental impact</div>
          </div>
          <div className="bg-dark-900/50 border border-dark-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-semibold mb-1">Live Dashboard</div>
            <div className="text-xs text-dark-400">Track aggregate results</div>
          </div>
        </div>
      </div>
    </div>
  );
}
