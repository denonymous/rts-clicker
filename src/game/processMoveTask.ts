import type { Element } from '../types/elements'
import type { MoveTask } from '../types/tasks'
import { elementsAreInRange, markTaskDone, moveElement } from '../util/utils'

type ProcessMoveTaskParams = {
  logInfo: (message: string) => void
  logAlert: (message: string) => void
  element: Element
  task: MoveTask
  now: number
}

type ProcessMoveTaskReturn = {
  updatedElement: Element
  updatedTask?: MoveTask
}

export const processMoveTask = ({ logInfo, logAlert, element, task, now }: ProcessMoveTaskParams): ProcessMoveTaskReturn => {
  const elementLocation = element.location
  const targetLocation = task.targetCoords

  if (!elementLocation) {
    logAlert(`Cannot continue task - ${task.description} - I don't know where I am`)
    return {
      updatedElement: {
        ...element,
        status: 'MIA'
      },
      updatedTask: {
        ...task,
        status: 'CANCELED'
      }
    }
  }

  if (!targetLocation) {
    logAlert(`Cannot perform task - ${task.description} - I cannot find it`)
    return {
      updatedElement: {
        ...element,
        status: 'Confused'
      },
      updatedTask: {
        ...task,
        status: 'CANCELED'
      }
    }
  }

  if (elementsAreInRange(elementLocation.coords, targetLocation)) {
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

  return {
    updatedElement: moveElement(element, targetLocation)
    // TODO does this need an updated status?
  }
}
