'use client'

import { IChainInfo, ICrossRule, Orbiter } from 'orbiter-bridge-sdk'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useNetwork } from 'wagmi'
import { useEthersSigner } from '@/hooks/useSigner'
import { useCheckChainId } from '@/hooks/check-chainId'
import { appMainnet } from '@/config/env'
import { toast } from '@/components/ui/use-toast'

export default function Bridge() {
  const orbiter = useRef({} as Orbiter)
  const [rules, setRules] = useState<ICrossRule[]>([])
  const [chains, setChains] = useState<IChainInfo[]>([])
  const [chainPairs, setChainPairs] = useState<{ [k: string]: string[] }>({})
  const [sourceChain, setSourceChain] = useState('')
  const [destChain, setDestChain] = useState('')
  const [sourceToken, setSourceToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [destChainList, setDestChainList] = useState<string[]>([])
  const [tokenList, setTokenList] = useState<{
    [k: string]: { [k: string]: string[] }
  }>({})
  const [rule, setRule] = useState({} as ICrossRule)

  const [amount, setAmount] = useState<number | string>(0)
  const [sendAmount, setSendAmount] = useState<number | string>('0')
  const [receiveAmount, setReceiveAmount] = useState<string | 0>('')
  const signer = useEthersSigner({ chainId: Number(sourceChain) })
  const { chains: networkChains } = useNetwork()
  const { checkChainIdToMainnet } = useCheckChainId()
  const [filterPairs, setFilterPairs] = useState<{ [k: string]: string[] }>({})

  useEffect(() => {
    if (!!Object.keys(chainPairs).length) {
      const filterChainPairs: { [k: string]: string[] } = {}
      for (const key in chainPairs) {
        if (networkChains.findIndex((v) => String(v.id) === key) !== -1) {
          filterChainPairs[key] = chainPairs[key]
        }
      }
      setFilterPairs(filterChainPairs)
    }
  }, [chainPairs, networkChains])

  useEffect(() => {
    if (!!Object.keys(filterPairs).length) {
      const initDestChain = filterPairs[sourceChain]?.filter(
        (item) => networkChains.findIndex((v) => String(v.id) === item) !== -1,
      )
      !sourceChain && setSourceChain(Object.keys(filterPairs)?.[0])
      setDestChainList(filterPairs[sourceChain])
      setDestChain(initDestChain?.[0])
    }
  }, [sourceChain, filterPairs, networkChains])

  const currentSourceTokens = useMemo(() => {
    return (
      (sourceChain && destChain && tokenList[`${sourceChain}/${destChain}`]) ||
      {}
    )
  }, [sourceChain, destChain, tokenList])

  const currentDestTokens = useMemo(() => {
    return (sourceToken && currentSourceTokens[sourceToken]) || []
  }, [sourceToken, currentSourceTokens])

  useEffect(() => {
    ;(!sourceToken ||
      !Object.keys(currentSourceTokens).includes(sourceToken)) &&
      setSourceToken(Object.keys(currentSourceTokens)?.[0] || '')
    setDestToken(currentDestTokens?.[0] || '')
  }, [sourceToken, currentSourceTokens, currentDestTokens])

  useEffect(() => {
    if (sourceChain && destChain && sourceToken && destToken) {
      const currentLine = `${sourceChain}/${destChain}-${sourceToken}/${destToken}`
      const findRule =
        rules.find((item) => item.line === currentLine) || ({} as ICrossRule)
      setRule(findRule)
    }
  }, [sourceChain, destChain, sourceToken, destToken, rules])

  useEffect(() => {
    resetAmounts()
  }, [sourceToken, destToken])

  const findChainInfo = (id: string) => {
    return chains.find((item) => item.chainId === id)
  }

  const dealRouter = (routerList: ICrossRule[]) => {
    const chainPairs: { [k: string]: string[] } = {}
    const tokenPairs: { [k: string]: { [k: string]: string[] } } = {}

    routerList.forEach((item) => {
      const [chainPair, tokenPair] = item.line.split('-')
      const [sourceChain, destChain] = chainPair.split('/')
      const [sourceToken, destToken] = tokenPair.split('/')

      chainPairs[sourceChain] = chainPairs[sourceChain]
        ? [...new Set([...chainPairs[sourceChain], destChain])]
        : [destChain]

      let tokenChainPair = tokenPairs[chainPair] || {}
      tokenChainPair[sourceToken] = tokenChainPair[sourceToken]
        ? [...new Set([...tokenChainPair[sourceToken], destToken])]
        : [destToken]
      tokenPairs[chainPair] = tokenChainPair
    })
    setChainPairs(chainPairs)
    setTokenList(tokenPairs)
  }

  const querySendValue = async (amount: number, rule: ICrossRule) => {
    const { formatSendAmount } = await orbiter.current.queryRealSendAmount({
      ruleConfig: rule,
      transferValue: amount,
    })
    setSendAmount(formatSendAmount)
  }

  const queryReceiveValue = async (amount: number, rule: ICrossRule) => {
    const receiveAmount = await orbiter.current.queryReceiveAmount(amount, rule)
    setReceiveAmount(receiveAmount)
  }

  useEffect(() => {
    const curAmount = Number(amount)
    if (curAmount > 0 && !!Object.keys(rule).length) {
      querySendValue(curAmount, rule)
      queryReceiveValue(curAmount, rule)
    }
  }, [amount, rule])

  const initPage = async () => {
    const routerList = await orbiter.current.queryRouters()
    const chains = await orbiter.current.queryChains()
    setRules(routerList)
    setChains(chains)
    dealRouter(routerList)
  }

  useEffect(() => {
    if (!signer) return
    orbiter.current.updateConfig({
      evmConfig: { signer, providerUrl: '', privateKey: '' },
    })
  }, [signer])

  useEffect(() => {
    orbiter.current = new Orbiter({
      isMainnet: appMainnet,
    })
    initPage()
  }, [])

  const resetAmounts = () => {
    setAmount('')
    setReceiveAmount(0)
    setSendAmount(0)
  }

  const handlerInput = (v: any): void => {
    let value = v.target.value
    if (!value) return resetAmounts()
    value = value.replace(/[^0-9.]/g, '')
    value = Number(value) > Number(rule.maxAmt) ? rule.maxAmt : value
    setAmount(value)
  }

  const handlerBridge = async () => {
    try {
      await checkChainIdToMainnet(sourceChain)
      await orbiter.current.toBridge({
        fromChainID: sourceChain,
        fromCurrency: sourceToken,
        toChainID: destChain,
        toCurrency: destToken,
        transferValue: Number(amount),
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        duration: 2000,
        title: error.message ?? error,
      })
      console.log(error)
    }
  }

  return (
    <main className="container flex-1 flex flex-col justify-center items-center">
      <Card className="max-w-[700px] w-full flex flex-col rounded-3xl">
        <CardTitle className="p-4">Bridge</CardTitle>
        <CardContent className="flex flex-1 py-[14px] px-[24px] flex-col">
          <div className="flex rounded-2xl bg-[#3f415b]/30 p-5 flex-col">
            <div className="mb-2">from</div>
            <div className="flex justify-between items-end">
              <Select
                value={sourceChain}
                onValueChange={(value) => {
                  if (value === sourceChain) return
                  setSourceChain(value)
                }}
              >
                <SelectTrigger className="w-[176px] bg-[#3f415b]/30 rounded-xl h-[40px]">
                  <SelectValue defaultValue={''} />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[250px]">
                  {Object.keys(chainPairs).map((item) => (
                    <SelectItem
                      key={item}
                      disabled={
                        networkChains.findIndex(
                          (v) => String(v.id) === item,
                        ) === -1
                      }
                      value={item}
                    >
                      <div className="flex items-center">
                        {findChainInfo(item)?.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sourceToken}
                onValueChange={(value) => {
                  if (value === sourceToken) return
                  setSourceToken(value)
                }}
              >
                <SelectTrigger className="w-[176px] ml-2 bg-[#3f415b]/30 rounded-xl h-[40px]">
                  <SelectValue defaultValue={''} />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[250px]">
                  {Object.keys(currentSourceTokens).map((item) => (
                    <SelectItem key={item} value={item}>
                      <div className="flex items-center">{item}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="h-[40px] mx-2 rounded-xl flex-1"
                placeholder={
                  rule.maxAmt && rule.minAmt
                    ? `${rule.maxAmt} > value > ${rule.minAmt}`
                    : '0'
                }
                value={amount}
                onChange={(v) => handlerInput(v)}
              ></Input>
              <div
                className="text-blue cursor-pointer"
                onClick={() => setAmount(Number(rule.maxAmt))}
              >
                Max
              </div>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <div className="mr-4">Real Send:</div>
            <div>{sendAmount}</div>
          </div>
          <div className="flex rounded-2xl bg-[#3f415b]/30 p-5 flex-col">
            <div className="mb-2">To</div>
            <div className="flex justify-between items-end">
              <Select
                value={destChain}
                onValueChange={(value) => {
                  if (value === destChain) return
                  setDestChain(value)
                }}
              >
                <SelectTrigger className="w-[176px] bg-[#3f415b]/30 rounded-xl h-[40px]">
                  <SelectValue defaultValue={''} />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[250px]">
                  {destChainList?.map((item) => (
                    <SelectItem
                      key={item}
                      disabled={
                        networkChains.findIndex(
                          (v) => String(v.id) === item,
                        ) === -1
                      }
                      value={item}
                    >
                      <div className="flex items-center">
                        {findChainInfo(item)?.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={destToken}
                onValueChange={(value) => {
                  if (value === destToken) return
                  setDestToken(value)
                }}
              >
                <SelectTrigger className="w-[176px] ml-2 bg-[#3f415b]/30 rounded-xl h-[40px]">
                  <SelectValue defaultValue={''} />
                </SelectTrigger>
                <SelectContent side="bottom" className="max-h-[250px]">
                  {currentDestTokens.map((item) => (
                    <SelectItem key={item} value={item}>
                      <div className="flex items-center">{item}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-[40px] mx-2 flex items-end rounded-xl flex-1">
                Receive: {receiveAmount || 0}
              </div>
            </div>
          </div>
          <div
            className="flex py-4 cursor-pointer mt-4 justify-center items-center bg-[#3f415b]/30 rounded-2xl text-[20px]"
            onClick={() => handlerBridge()}
          >
            To Bridge
          </div>
        </CardContent>
      </Card>
    </main>
  )
}