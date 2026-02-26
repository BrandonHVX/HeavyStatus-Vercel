'use client'

import { useState, useEffect } from 'react'

export default function AddToHomeScreen() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('a2hs_dismissed')
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    if (!dismissed && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    sessionStorage.setItem('a2hs_dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <div>
      <div>
        <p>Add to Home Screen</p>
        <p>Tap the share button then &quot;Add to Home Screen&quot; for the best experience</p>
        <button onClick={handleDismiss} aria-label="Dismiss">&times;</button>
      </div>
    </div>
  )
}
