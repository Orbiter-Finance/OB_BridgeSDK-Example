'use client'
import { cn } from '@/lib/utils'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export function ConnectButton(
  props: Partial<{
    text: string
    classNames: string
  }>,
) {
  const { classNames, text } = props
  const { openConnectModal } = useConnectModal()
  return (
    <div
      className={cn(classNames)}
      onClick={() => openConnectModal && openConnectModal()}
    >
      {text}
    </div>
  )
}
