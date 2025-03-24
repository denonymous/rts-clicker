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
