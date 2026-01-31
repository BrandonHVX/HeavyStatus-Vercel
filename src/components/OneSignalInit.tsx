'use client'

import { useEffect } from 'react'

interface OneSignalInstance {
  init: (config: {
    appId: string
    allowLocalhostAsSecureOrigin?: boolean
    notifyButton?: { enable: boolean }
    promptOptions?: {
      slidedown?: {
        prompts?: Array<{
          type: string
          autoPrompt?: boolean
          text?: {
            actionMessage?: string
            acceptButton?: string
            cancelButton?: string
          }
          delay?: {
            pageViews?: number
            timeDelay?: number
          }
        }>
      }
    }
  }) => Promise<void>
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: OneSignalInstance) => void>
  }
}

export default function OneSignalInit() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    if (!appId) return

    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function(OneSignal: OneSignalInstance) {
      await OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                text: {
                  actionMessage: "Get notified when new stories are published!",
                  acceptButton: "Allow",
                  cancelButton: "No Thanks",
                },
                delay: {
                  pageViews: 1,
                  timeDelay: 5,
                },
              },
            ],
          },
        },
      })
    })

    const script = document.createElement('script')
    script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return null
}
