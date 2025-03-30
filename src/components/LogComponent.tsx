import { useContext } from 'react'
import { LogContext } from '../context/LogContext'

export const LogComponent = () => {
  const { log } = useContext(LogContext)

  return (
    <ul>
      {log.map(entry => (
        <li key={entry.__id}>
          [{entry.level.toUpperCase()}] {entry.message}
        </li>
      ))}
    </ul>
  )
}
