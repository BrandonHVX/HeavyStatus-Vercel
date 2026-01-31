'use client'

import { useState, useEffect } from 'react'

export default function AddToHomeScreen() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('a2hs_dismissed')
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    if (!dismissed && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('a2hs_dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <div className="fixed md:hidden bottom-[92px] left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#050505] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">HS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 leading-tight">
              Add to Home Screen
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">
              Tap <svg className="inline-block w-4 h-4 -mt-0.5 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> then &quot;Add to Home Screen&quot; for the best experience
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
