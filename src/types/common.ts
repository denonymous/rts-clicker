import { TaskKey, TaskQueue } from "./tasks"

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

export type Element = {
  __id: string
  location: Location
  name: string
  hitPoints: number
  availableTasks: readonly TaskKey[]
  taskQueue: TaskQueue
}

type SerializedCoords = string
type ElementId = string
export type Grid = Map<SerializedCoords, Set<ElementId>>

export type ErrorCode = 'ELEMENT_NOT_ON_GRID' | 'INVALID_GRID_COORDS'
