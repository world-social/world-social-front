'use client'

import { ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export default function MiniKitProvider({ appId, children }: { appId?: string; children: ReactNode }) {
    useEffect(() => {
        // Passing appId in the install is optional 
        // but allows you to access it later via `window.MiniKit.appId`
        MiniKit.install(appId)
    }, [appId])

    return <>{children}</>
}