import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">♻️</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              EWaste Tracker
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/register"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Register Device
            </Link>
            <Link
              href="/dashboard"
              className="text-dark-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
