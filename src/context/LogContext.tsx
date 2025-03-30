import { createContext } from 'react'
import type { Element } from '../types/elements'
import type { LogEntry } from '../types/common'

type LogContext = {
  log: readonly LogEntry[]
  logInfo: (element: Element) => (s: string) => void
  logAlert: (element: Element) => (s: string) => void
}

export const LogContext = createContext<LogContext>({
  log: [],
  logInfo: (_e: Element) => (_s: string) => null,
  logAlert: (_e: Element) => (_s: string) => null
})
