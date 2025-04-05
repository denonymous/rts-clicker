import { createContext } from 'react'
import { v4 as uuid } from 'uuid'
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

export const buildLogContext = (
  log: readonly LogEntry[],
  setLog: React.Dispatch<React.SetStateAction<readonly LogEntry[]>>
) => {
  const logMessage = (level: LogEntry['level'], element: Element, message: string) => setLog(curr => [
    ...curr,
    {
      __id: uuid(),
      level,
      timestamp: new Date().getTime(),
      writtenBy: element.__id,
      message: `${element.name}: ${message}`
    }
  ])
  const logInfo = (element: Element) => (message: string) => logMessage('INFO', element, message)
  const logAlert = (element: Element) => (message: string) => logMessage('ALERT', element, message)

  return {
    log,
    logInfo,
    logAlert
  }

}
