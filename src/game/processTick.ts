import type { Resources } from '../types/common'
import type { Element } from '../types/elements'
import type { BuildTask, MoveTask } from '../types/tasks'
import {
  calculateNextStep,
  canAfford,
  elementsAreInRange,
  markTaskBegun,
  markTaskCannotAfford,
  markTaskDone
} from '../util/utils'

type ProcessTaskQueueParams = {
  currentResources: Resources
  removeCrystals: (val: number) => void
  removeGas: (val: number) => void
}

type ProcessTickParams = ProcessTaskQueueParams & {
  logInfo: (element: Element) => (message: string) => void
  logAlert: (element: Element) => (message: string) => void
  elements: readonly Element[]
  updateElements: (_: readonly Element[]) => void
}

export const processTick = ({
  currentResources,
  removeCrystals,
  removeGas,
  logInfo,
  logAlert,
  elements,
  updateElements
}: ProcessTickParams) => {
  const now = new Date().getTime()

  const params = {
    currentResources,
    removeCrystals,
    removeGas
  }
  const updatedElements = elements.map(e =>
    processElementTaskQueue({
      ...params,
      logInfo: logInfo(e),
      logAlert: logAlert(e),
      element: e,
      now
    })
  )
  updateElements(updatedElements)
}

type ProcessElementTaskQueueParams = ProcessTaskQueueParams & {
  logInfo: (message: string) => void
  logAlert: (message: string) => void
  element: Element
  now: number
}

/**
 * Process an element's task queue for a tick
 * 
 * If it has no tasks in progress, try to start one.
 * 
 * Return element with updated data (task queue, location, etc)
 */
const processElementTaskQueue = ({
  currentResources,
  removeCrystals,
  removeGas,
  logInfo,
  logAlert,
  element,
  now
}: ProcessElementTaskQueueParams): Element => {

  const tasksInProgress = element.taskQueue.reduce((acc, curr) => curr.status === 'IN PROGRESS' ? acc + 1 : acc, 0)

  if (!tasksInProgress) {
    const taskToStart = element.taskQueue.find(task => !['IN PROGRESS', 'COMPLETE'].includes(task.status))

    if (taskToStart) {
      if (canAfford(currentResources, taskToStart.cost)) {
        removeCrystals(taskToStart.cost.crystals)
        removeGas(taskToStart.cost.gas)

        element.taskQueue = [
          ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
          markTaskBegun(taskToStart, now)
        ]
        logInfo(`Starting task - ${taskToStart.description}`)
      } else {
        element.taskQueue = [
          ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
          markTaskCannotAfford(taskToStart)
        ]
        logAlert(`Could not afford to start task - ${taskToStart.description}`)
      }
    }
  }

  const updatedElement = element.taskQueue.reduce((updatingElement, task) => {
    if (task.status === 'IN PROGRESS') {
      if (task.__type === 'BUILD') {
        const updatedTask = processBuildTask({ logInfo, element: updatingElement, task, now })
        return {
          ...updatingElement,
          taskQueue: [
            ...updatingElement.taskQueue.filter(_task => _task.__id !== task.__id),
            updatedTask
          ]
        }
      }

      if (task.__type === 'MOVE') {
        const { updatedElement: movedElement, updatedTask } = processMoveTask({ logInfo, logAlert, element: updatingElement, task, now })
        return {
          ...movedElement,
          taskQueue: [
            ...movedElement.taskQueue.filter(_task => _task.__id !== task.__id),
            updatedTask
          ]
        }
      }
    }

    return updatingElement
  }, { ...element })

  return updatedElement
}

type ProcessBuildTaskParams = {
  element: Element
  logInfo: (message: string) => void
  task: BuildTask
  now: number
}

const processBuildTask = ({ logInfo, task, now }: ProcessBuildTaskParams): BuildTask => {
  if (task.startedAt && now >= (task.startedAt + (task.duration * 1000))) {
    task.onComplete()
    logInfo(`Finished task - ${task.description}`)
    return markTaskDone(task, now)
  }

  return task
}

type ProcessMoveTaskParams = {
  logInfo: (message: string) => void
  logAlert: (message: string) => void
  element: Element
  task: MoveTask
  now: number
}

type ProcessMoveTaskReturn = {
  updatedElement: Element
  updatedTask: MoveTask
}

const processMoveTask = ({ logInfo, logAlert, element, task, now }: ProcessMoveTaskParams): ProcessMoveTaskReturn => {
  const elementLocation = element.location
  const targetLocation = task.target

  if (!elementLocation) {
    logAlert(`Cannot continue task - ${task.description} - I don't know where I am`)
    return {
      updatedElement: element,
      updatedTask: task
    }
  }

  if (!targetLocation) {
    logAlert(`Cannot continue task - ${task.description} - I cannot find it`)
    return {
      updatedElement: element,
      updatedTask: task
    }
  }

  if (elementsAreInRange(elementLocation.coords, targetLocation)) {
    task.onComplete()
    logInfo(`Finished task - ${task.description}`)
    return {
      updatedElement: element,
      updatedTask: markTaskDone(task, now)
    }
  }

  // TODO validate move
  const nextStep = calculateNextStep(elementLocation.coords, targetLocation)

  return {
    updatedElement: {
      ...element,
      location: {
        ...element.location,
        coords: nextStep
      }
    },
    updatedTask: task
  }
}
