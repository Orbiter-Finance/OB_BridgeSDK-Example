'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ViewVerticalIcon } from '@radix-ui/react-icons'
import { docsConfig } from '@/config/docs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathName = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Image src={'/menu.png'} width={40} height={40} alt=""></Image>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Link href={'/'}>
            <Image src="/logo.png" width={131} height={32} alt=""></Image>
          </Link>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <div className="flex flex-col space-y-3">
            {docsConfig.mainNav?.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'pl-2',
                      pathName === item.href ||
                        (item.href === '/home' && pathName === '/')
                        ? 'bg-[#4959FF] font-bold rounded-[4px]'
                        : '',
                    )}
                    onOpenChange={setOpen}
                  >
                    {item.title}
                  </MobileLink>
                ),
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {docsConfig?.sidebarNav &&
              docsConfig.sidebarNav.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map((item) => (
                      <React.Fragment key={item.href}>
                        {!item.disabled &&
                          (item.href ? (
                            <MobileLink
                              href={item.href}
                              onOpenChange={setOpen}
                              className="text-muted-foreground"
                            >
                              {item.title}
                            </MobileLink>
                          ) : (
                            item.title
                          ))}
                      </React.Fragment>
                    ))}
                </div>
              ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
