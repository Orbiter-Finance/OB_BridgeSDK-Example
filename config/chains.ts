import { appMainnet } from './env'
import chainsTestnet from '@/config/chains.test.json'
import chainsMainnet from '@/config/chains.json'

export interface ChainInterface {
  chainId: string | number
  networkId: string | number
  internalId: string | number
  name: string

  api: {
    url: string
    key: string
    intervalTime?: number
  }
  nativeCurrency: {
    name?: string
    symbol?: string
    decimals?: number
    address?: string
  }
  rpc: string[]
  watch?: string[]
  alchemyApi?: {
    category: string[]
  }
  contracts?: string[]
  tokens: {
    name: string
    symbol: string
    decimals: number
    address: string
    id?: number
  }[]
  xvmList?: string[]
  infoURL?: string
}
export const chainsJson: ChainInterface[] = appMainnet
  ? chainsMainnet
  : chainsTestnet
