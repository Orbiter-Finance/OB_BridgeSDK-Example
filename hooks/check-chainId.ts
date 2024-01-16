import { ToastActionElement } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useCallback, useMemo } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export function useCheckChainId() {
  const { toast } = useToast()
  const { chain, chains } = useNetwork()
  const { switchNetworkAsync } = useSwitchNetwork()

  const changeNetworkAsync = async (id: number) => {
    switchNetworkAsync && (await switchNetworkAsync(id))
  }

  const checkChainIdToMainnet = useCallback(
    async (
      targetChainId: number | string,
    ): Promise<void | {
      id: string
      dismiss: () => void
      update: (props: any) => void
    }> => {
      if (chain && chain?.id === Number(targetChainId)) return
      if (
        !!Number(targetChainId) &&
        chains.findIndex((v) => v.id === Number(targetChainId)) !== -1
      ) {
        return await changeNetworkAsync(Number(targetChainId))
      } else {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'please add chain .',
        })
      }
    },
    [chain, chains],
  )

  return {
    checkChainIdToMainnet,
  }
}
