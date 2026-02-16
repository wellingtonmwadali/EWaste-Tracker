import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span className="text-primary-400 text-sm font-semibold">
              ♻️ AI-Powered Blockchain Solution
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
            Track E-Waste,
            <br />
            Save the Planet
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-dark-300 max-w-3xl mx-auto mb-12">
            Transparent blockchain tracking meets AI-powered environmental impact measurement.
            Every device recycled makes a verified difference.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Link href="/register" className="btn-primary text-lg">
              Register Your Device
            </Link>
            <Link href="/dashboard" className="btn-secondary text-lg">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Problem 1 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">53.6M Tons Annually</h3>
            <p className="text-dark-400">
              Global e-waste generation continues to rise, with only 17.4% properly recycled.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Zero Transparency</h3>
            <p className="text-dark-400">
              Most consumers have no idea what happens to their devices after disposal.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">☠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Toxic Materials</h3>
            <p className="text-dark-400">
              E-waste contains lead, mercury, and other hazardous materials polluting our environment.
            </p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Solution</h2>
          <p className="text-xl text-dark-300">
            Blockchain transparency + AI intelligence = Verified environmental impact
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="stat-card">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3">Blockchain Tracking</h3>
            <p className="text-dark-400">
              Immutable lifecycle records from disposal to recycling. Every status change is permanently recorded.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="stat-card">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">AI Impact Measurement</h3>
            <p className="text-dark-400">
              Real-time calculation of CO₂ saved, toxic waste prevented, and sustainability scores.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="stat-card">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Live Dashboard</h3>
            <p className="text-dark-400">
              Track aggregate impact across all devices. Watch the environmental benefits grow in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="card">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Register Device</h3>
              <p className="text-dark-400">
                Enter device type, weight, and location. We calculate projected environmental impact instantly.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-primary-500 text-2xl">
              →
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="card">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Lifecycle</h3>
              <p className="text-dark-400">
                Watch your device move through: Disposed → Collected → Recycled. All on blockchain.
              </p>
            </div>
            {/* Arrow */}
            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-primary-500 text-2xl">
              →
            </div>
          </div>

          {/* Step 3 */}
          <div className="card">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Verify Impact</h3>
            <p className="text-dark-400">
              When recycled, AI verifies actual CO₂ saved and toxic waste prevented. See real results.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join the transparent e-waste revolution. Track your device's journey today.
          </p>
          <Link href="/register" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 inline-block">
            Register Your First Device
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-dark-400">
          <p>Built with 💚 for a sustainable future</p>
          <p className="mt-2 text-sm">Blockchain + AI = Transparent Environmental Impact</p>
        </div>
      </footer>
    </div>
  );
}
