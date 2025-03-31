import type { Element } from '../types/elements'
import type { BuildTask } from '../types/tasks'
import { markTaskDone } from '../util/utils'

type ProcessBuildTaskParams = {
  element: Element
  logInfo: (message: string) => void
  task: BuildTask
  now: number
}

type ProcessBuildTaskReturn = {
  updatedElement?: Element
  updatedTask?: BuildTask
}

export const processBuildTask = ({ element, logInfo, task, now }: ProcessBuildTaskParams): ProcessBuildTaskReturn => {
  if (task.startedAt && now >= (task.startedAt + (task.duration * 1000))) {
    task.onComplete()

    logInfo(`Finished task - ${task.description}`)

    return {
      updatedElement: {
        ...element,
        status: 'Idle'
      },
      updatedTask: markTaskDone(task, now)
    }
  }

  return {}
}
