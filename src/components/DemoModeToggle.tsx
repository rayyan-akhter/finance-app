'use client'

import { useState, useEffect } from 'react'
import { Settings, Zap, Database } from 'lucide-react'
import { isDemoMode } from '@/lib/config'

export default function DemoModeToggle() {
  const [isDemo, setIsDemo] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    setIsDemo(isDemoMode())
  }, [])

  const handleToggle = () => {
    const newMode = !isDemo
    setIsDemo(newMode)
    
    // Store in localStorage for persistence
    localStorage.setItem('demoMode', newMode.toString())
    
    // Reload page to apply changes
    window.location.reload()
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        title="Demo Mode Settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Demo Mode</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${isDemo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-700">
                {isDemo ? 'Demo Mode Active' : 'Production Mode'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isDemo 
                ? 'Using demo data and local storage. Perfect for testing and demonstrations.'
                : 'Using production APIs and database. Real data and features enabled.'
              }
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-700">Demo Mode</span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDemo ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDemo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Feature Comparison */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">
                {isDemo ? 'Local Storage' : 'Database'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">
                {isDemo ? 'Mock Data' : 'Real-time Updates'}
              </span>
            </div>
          </div>

          {/* Warning */}
          {!isDemo && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ Production mode requires backend setup and database configuration.
            </div>
          )}
        </div>
      )}
    </div>
  )
} 