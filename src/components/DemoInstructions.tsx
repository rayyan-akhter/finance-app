'use client'

import { useState } from 'react'
import { Info, X, CheckCircle, Zap, Database, Users } from 'lucide-react'

export default function DemoInstructions() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 animate-fade-in mx-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2">
              🎯 Demo Mode Active
            </h3>
            <p className="text-xs sm:text-sm text-blue-700 mb-2 sm:mb-3">
              This is a demonstration of the fintech loan platform. All data is stored locally and resets when you refresh the page.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-blue-700">Multiple loan types</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-blue-700">Quick application process</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                <span className="text-blue-700">Competitive rates</span>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 text-xs text-blue-600">
              <strong>Try it out:</strong> Create an account, explore loan types, and click "Apply Now" to see the demo flow!
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  )
} 