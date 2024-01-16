'use client'

import { createContext } from 'react'
import { Chain } from 'viem'

const defaultValue: { chains?: Chain[] } = {}
export const AppContext = createContext(defaultValue)
