import { Element } from './common'

export type TaskType = 'BUILD' | 'MOVE'
export type TaskKey = 'CREATE_ENGINEER' | 'CREATE_COMMAND_CENTER' | 'MOVE TO'

export type TaskStatus = 'QUEUED' | 'NOT ENOUGH RESOURCES' | 'IN PROGRESS' | 'COMPLETE'

export type TaskCost = {
  crystals: number
  gas: number
}

export type Task = {
  __id: string
  __key: TaskKey
  __type: TaskType
  cost: TaskCost
  description: string
  status: TaskStatus
  startedAt?: number
  finishedAt?: number
}

export type BuildTask = Task & {
  duration: number
  onComplete: () => void
}

export type MoveTask = Task & {
  target: Element
  onComplete: () => void
}

export type TaskQueue = readonly (BuildTask | MoveTask)[]
