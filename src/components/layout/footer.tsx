'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          {/* Main Copyright */}
          <p className="text-sm text-gray-500">
            © 2025 CodeSurge AI. All rights reserved.
          </p>
          
          {/* App Branding with Subscript */}
          <div className="flex items-center justify-center space-x-1">
            <h3 className="text-lg font-semibold text-gray-900">PulseIQ</h3>
            <span className="text-xs text-gray-400 self-end mb-0.5">by CodeSurge AI</span>
          </div>
          
          {/* Optional Additional Links */}
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <span>Healthcare Analytics Platform</span>
            <span>•</span>
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}