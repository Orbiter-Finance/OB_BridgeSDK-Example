'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex-1 absolute top-[50%] hidden left-[50%] translate-x-[-50%] translate-y-[-50%] md:flex">
      <div className="flex-1 justify-center flex">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href={`/`}
            className={cn(
              'rounded-[22px]',
              pathname === '/home' || pathname === '/'
                ? 'bg-[#4959FF]/40 font-bold rounded-[22px]'
                : 'text-[#fff]',
            )}
          >
            <div className="py-[10px] px-[16px]">Home</div>
          </Link>
        </nav>
      </div>
    </div>
  )
}
