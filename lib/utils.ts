import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

dayjs.extend(relativeTime)
export interface IStatisticItem {
  chainName: string
  chainId: string
  internalId: string
  tx: string
  amount: string
  userTx: string
  userAmount: string
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateSafeCode = (
  chainId: number | string,
  statisticDetail: IStatisticItem[],
): bigint => {
  const currentChainInfo = statisticDetail.find(
    (v) => String(v.chainId) == String(chainId),
  )
  if (!currentChainInfo) throw new Error('Can not find the chain internalId.')
  return BigInt(9000 + Number(currentChainInfo.internalId))
}

export function dateFormatStandard(
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  formatType?: string | undefined,
) {
  if (!date) return '-'
  return dayjs(date).format(formatType || 'YYYY-MM-DD HH:mm:ss')
}

export function formatAddress(
  address: string,
  startCount: number = 6,
  endCount: number = 4,
): string {
  if (!address) return '-'
  if (startCount + endCount >= address.length) return address
  const currentAddress = address + ''
  return (
    currentAddress.substring(0, startCount) +
    '...' +
    currentAddress.substring(
      currentAddress.length - endCount,
      currentAddress.length,
    )
  )
}

export function formatCurrency(
  number: number | string,
  defaultCurrency: string | number,
) {
  if (!number) return defaultCurrency
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
