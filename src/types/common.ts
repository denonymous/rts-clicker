import type { Task, TaskKey } from './tasks'

export type UUID = string

export type Coords = {
  x: number
  y: number
}

export type Direction = {
  name: string
  offset: Coords
}

export type Location = {
  coords: Coords
  direction: Direction
}

export type TaskQueue = readonly Task[]

export type ElementPrototype = {
  __id: string
  location: Location
  name: string
  hitPoints: number
  availableTasks: readonly TaskKey[]
  taskQueue: TaskQueue
}

export type ErrorCode = 'ELEMENT_NOT_ON_GRID' | 'INVALID_GRID_COORDS'

export type Resources = {
  crystals: number
  gas: number
}

type LogLevel = 'INFO' | 'ALERT'

export type LogEntry = {
  __id: UUID
  level: LogLevel
  timestamp: number
  writtenBy: UUID
  message: string
}
