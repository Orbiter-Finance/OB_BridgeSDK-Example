'use client'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'

interface DataTablePaginationCopyProps {
  pageIndex: number
  pageCount: number
  isHadNextPage: boolean
  setPageIndex: Function
  setIsHadNextPage: Function
}

export function DataTablePagination(props: DataTablePaginationCopyProps) {
  const {
    pageIndex,
    pageCount,
    isHadNextPage,
    setPageIndex,
    setIsHadNextPage,
  } = props

  const canPreviousPage = useMemo(() => {
    return pageIndex !== 1
  }, [pageIndex])

  const canNextPage = useMemo(() => {
    return isHadNextPage
  }, [isHadNextPage])

  const handlerClickFirst = () => {
    setPageIndex(1)
  }
  const handlerClickLast = () => {
    setPageIndex(pageIndex - 1)
  }
  const handlerClickNext = () => {
    if (pageIndex + 1 === pageCount) {
      setIsHadNextPage(false)
      setPageIndex(pageIndex + 1)
      return
    }
    setPageIndex(pageIndex + 1)
  }
  const handlerClickLastNo = () => {
    setPageIndex(pageCount)
    setIsHadNextPage(false)
  }
  return (
    <div className="flex mt-2">
      <div className="flex space-x-6 w-full justify-end lg:space-x-8">
        <div className="flex justify-end">
          <div className="flex w-[150px] items-center justify-center text-sm font-medium">
            Page {pageIndex} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlerClickFirst()}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlerClickLast()}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlerClickNext()}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlerClickLastNo()}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
