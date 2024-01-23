'use client'

import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  okxWallet,
  coin98Wallet,
  safepalWallet,
  bitgetWallet,
  rainbowWallet,
  walletConnectWallet,
  argentWallet,
} from '@rainbow-me/rainbowkit/wallets'
import {
  mainnet,
  arbitrum,
  zkSync,
  optimism,
  manta,
  zora,
  polygon,
  polygonZkEvm,
  opBNB,
  mantle,
  kroma,
  linea,
  base,
  scroll,
  bsc,
  arbitrumNova,
  zkFair,
} from 'wagmi/chains'
import {
  optimismGoerli,
  goerli,
  arbitrumSepolia,
  zkSyncSepoliaTestnet,
  polygonZkEvmTestnet,
  mantaTestnet,
  zoraSepolia,
  zoraTestnet,
  kromaSepolia,
  lineaTestnet,
  baseGoerli,
  baseSepolia,
  taikoTestnetSepolia,
  scrollSepolia,
  scrollTestnet,
  sepolia,
  mantleTestnet,
  bscTestnet,
} from 'wagmi/chains'
import { Chain, configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { AppContext } from './app-context'
import { CHAINS_ICON_LIST } from '@/config/icon'
import { useTheme } from 'next-themes'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'

const chainsMainnet = [
  mainnet,
  arbitrum,
  zkSync,
  { ...optimism, iconUrl: CHAINS_ICON_LIST[optimism.id], name: 'Optimism' },
  manta,
  zora,
  polygon,
  arbitrumNova,
  zkFair,
  polygonZkEvm,
  opBNB,
  mantle,
  kroma,
  linea,
  base,
  scroll,
  bsc,
]

const chainsTestnet = [
  goerli,
  arbitrumSepolia,
  { ...optimismGoerli, iconUrl: CHAINS_ICON_LIST[optimismGoerli.id] },
  zkSyncSepoliaTestnet,
  polygonZkEvmTestnet,
  mantaTestnet,
  zoraSepolia,
  zoraTestnet,
  kromaSepolia,
  lineaTestnet,
  baseGoerli,
  baseSepolia,
  taikoTestnetSepolia,
  scrollSepolia,
  scrollTestnet,
  sepolia,
  mantleTestnet,
  bscTestnet,
]
const currentChains: Chain[] = [...chainsMainnet, ...chainsTestnet]

const { chains, publicClient } = configureChains(currentChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])
const walletOptions = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains,
}
const connectors = connectorsForWallets([
  {
    groupName: 'Suggested',
    wallets: [
      metaMaskWallet(walletOptions),
      okxWallet(walletOptions),
      coin98Wallet(walletOptions),
      safepalWallet(walletOptions),
      bitgetWallet(walletOptions),
      rainbowWallet(walletOptions),
      walletConnectWallet(walletOptions),
      argentWallet(walletOptions),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [rainbowThemeFn, setRainbowThemeFn] = useState<any>({})

  useEffect(() => {
    setTheme('dark')
  }, [])

  useEffect(() => {
    setRainbowThemeFn(theme === 'light' ? lightTheme() : darkTheme())
  }, [theme])

  return (
    <AppContext.Provider value={{ chains }}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          locale="en-US"
          theme={rainbowThemeFn}
          chains={chains}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </AppContext.Provider>
  )
}
