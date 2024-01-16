'use client'

import { useEffect, useState } from 'react'
import { MainNav } from '@/components/main-nav'
import { ConnectButton } from './connect-button'
import { ConnectButton as ConnectButtonAsRainbowkit } from '@rainbow-me/rainbowkit'
import { ModeToggle } from './mode-toggle'
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { MobileNav } from './mobile-nav'

export function SiteHeader() {
  const [connected, setConnected] = useState(false)
  const { isConnected } = useAccount()

  useEffect(() => {
    setConnected(isConnected)
  }, [isConnected])

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container relative flex h-24 justify-between items-center md:min-w-[770px] w-[100%]">
        <Link className="hidden md:block" href={'/'}>
          <Image src="/logo.png" width={52} height={32} alt=""></Image>
        </Link>
        <MainNav />
        <MobileNav />
        <nav className="flex items-center">
          <ModeToggle></ModeToggle>
          {!connected ? (
            <ConnectButton
              text="Connect Wallet"
              classNames={cn(
                'w-[185px] h-[48px] text-[18px] flex justify-center select-none cursor-pointer items-center bg-[#4959FF] text-[#fff] rounded-[28px] py-[12px] px-[24px]',
              )}
            />
          ) : (
            <ConnectButtonAsRainbowkit
              accountStatus={'address'}
              chainStatus={'icon'}
              showBalance={false}
            ></ConnectButtonAsRainbowkit>
          )}
        </nav>
      </div>
    </header>
  )
}
