import type { Coords, Resources } from './common'
import { Resource } from './resources'

export type TaskKey = 'CREATE_ENGINEER' | 'CREATE_COMMAND_CENTER' | 'MOVE TO' | 'GATHER RESOURCE'

export type TaskStatus = 'QUEUED' | 'NOT ENOUGH RESOURCES' | 'IN PROGRESS' | 'COMPLETE' | 'CANCELED'

type TaskPrototype = {
  __id: string
  __key: TaskKey
  cost: Resources
  description: string
  status: TaskStatus
  startedAt?: number
  finishedAt?: number
}

export type BuildTask = TaskPrototype & {
  __type: 'BUILD'
  duration: number
  onComplete: () => void
}

export type MoveTask = TaskPrototype & {
  __type: 'MOVE'
  targetCoords: Coords
  onComplete: () => void
}

export type GatherTask = TaskPrototype & {
  __type: 'GATHER'
  targetResource: Resource
  phase: 'MOVING TO RESOURCE' | 'GATHERING RESOURCE' | 'RETURNING RESOURCE'
  phaseStartedAt?: number
  onComplete: () => void
}

export type Task = BuildTask | MoveTask | GatherTask
