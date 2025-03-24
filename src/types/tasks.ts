export type TaskType = 'BUILD' | 'ASSIGNMENT'
export type TaskKey = 'CREATE_ENGINEER' | 'CREATE_COMMAND_CENTER'

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

export type AssignmentTask = Task & {}

export type TaskQueue = readonly (BuildTask | AssignmentTask)[]
