import type { Resources } from '../types/common'
import type { Element } from '../types/elements'
import { Resource } from '../types/resources'
import { CommandCenter } from '../types/structures'
import type { Task } from '../types/tasks'
import {
  canAfford,
  getTaskStatus,
  markTaskBegun,
  markTaskCanceled,
  markTaskCannotAfford
} from '../util/utils'
import { processBuildTask } from './processBuildTask'
import { processGatherTask } from './processGatherTask'
import { processMoveTask } from './processMoveTask'

type ProcessTaskQueueParams = {
  currentResources: Resources
  removeCrystals: (val: number) => void
  removeGas: (val: number) => void
}

type ProcessTickParams = ProcessTaskQueueParams & {
  logInfo: (element: Element) => (message: string) => void
  logAlert: (element: Element) => (message: string) => void
  addCrystals: (val: number) => void
  addGas: (val: number) => void
  elements: readonly Element[]
  updateElements: (_: readonly Element[]) => void
}

export const processTick = ({
  currentResources,
  addCrystals,
  removeCrystals,
  addGas,
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
    removeGas,
    addCrystals,
    addGas,
    commandCenters: elements.filter(e => e.__type === 'COMMAND CENTER'),
    resources: elements.filter(e => e.__elementType === 'RESOURCE'),
    now
  }

  const updatedElements = elements.map(e =>
    processElementTaskQueue({
      ...params,
      logInfo: logInfo(e),
      logAlert: logAlert(e),
      element: e
    })
  ).flat()

  updateElements(updatedElements)
}

type ProcessElementTaskQueueParams = ProcessTaskQueueParams & {
  logInfo: (message: string) => void
  logAlert: (message: string) => void
  addCrystals: (val: number) => void
  addGas: (val: number) => void
  commandCenters: readonly CommandCenter[]
  resources: readonly Resource[]
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
  addCrystals,
  removeCrystals,
  addGas,
  removeGas,
  logInfo,
  logAlert,
  commandCenters,
  resources,
  element,
  now
}: ProcessElementTaskQueueParams): readonly Element[] => {
  const _element = element.taskQueue.reduce((acc, curr) => curr.status === 'IN PROGRESS' ? acc + 1 : acc, 0) === 0
    ? startNewTask(element, currentResources, logInfo, logAlert, removeCrystals, removeGas, now)
    : element

  return _element.taskQueue
    .filter(task => task.status === 'IN PROGRESS')
    .reduce((updatedElements, task) => {
      if (task.__type === 'BUILD') {
        const { updatedElement, updatedTask } = processBuildTask({ logInfo, element: _element, task, now })
        const elementChanges = parseTaskQueueResults({ element: _element, updatedElement, updatedTask })

        return elementChanges.length
          ? [...updatedElements, ...elementChanges]
          : updatedElements
      }
      else if (task.__type === 'MOVE') {
        const { updatedElement, updatedTask } = processMoveTask({ logInfo, logAlert, element: _element, task, now })
        const elementChanges = parseTaskQueueResults({ element: _element, updatedElement, updatedTask })

        return elementChanges.length
          ? [...updatedElements, ...elementChanges]
          : updatedElements
      }
      else if (task.__type === 'GATHER') {
        const {
          updatedElement,
          additionalUpdatedElements,
          updatedTask
        } = processGatherTask({ logAlert, addCrystals, addGas, commandCenters, resources, element: _element, task, now })
        const elementChanges = parseTaskQueueResults({ element: _element, updatedElement, updatedTask, additionalUpdatedElements })

        return elementChanges.length
          ? [...updatedElements, ...elementChanges]
          : updatedElements
      }

      return updatedElements
    }, <readonly Element[]>[])
}

type ParseTaskQueueResultsParams = {
  element: Element
  updatedElement?: Element
  updatedTask?: Task
  additionalUpdatedElements?: readonly Element[]
}

/**
 * Parse out a given element and optional element updates, optional task updates, and
 * optional updated to additional elements in order to return an array of element updates,
 * including task queue changes to the canonical element if needed.
 * 
 * No updates will return an empty array to signify no updates to even the canonical element.
 */
const parseTaskQueueResults = ({
  element,
  updatedElement,
  updatedTask,
  additionalUpdatedElements = []
}: ParseTaskQueueResultsParams): readonly Element[] => {
  if (updatedTask && updatedElement) {
    return [
      ...additionalUpdatedElements,
      updateTaskQueue(updatedElement, updatedTask)
    ]
  }
  else if (updatedTask) {
    return [
      ...additionalUpdatedElements,
      updateTaskQueue(element, updatedTask)
    ]
  }
  else if (updatedElement) {
    return [
      ...additionalUpdatedElements,
      updatedElement
    ]
  }

  return [ element ]
}

/**
 * Update a given task in a given element's task queue and return the updated element
 */
const updateTaskQueue = (element: Element, task: Task): Element => ({
  ...element,
  taskQueue: [
    ...element.taskQueue.filter(_task => _task.__id !== task.__id),
    task
  ]
})

const startNewTask = (
  element: Element,
  currentResources: Resources,
  logInfo: (message: string) => void,
  logAlert: (message: string) => void,
  removeCrystals: (val: number) => void,
  removeGas: (val: number) => void,
  now: number
): Element => {
  const taskToStart = element.taskQueue.find(task => !['IN PROGRESS', 'COMPLETE'].includes(task.status))

  if (!taskToStart) {
    return element
  }

  if (!canAfford(currentResources, taskToStart.cost)) {
    if (taskToStart.status !== 'NOT ENOUGH RESOURCES') {
      logAlert(`Could not afford to start task - ${taskToStart.description}`)
    }
    return updateTaskQueue(element, markTaskCannotAfford(taskToStart))
  }

  if (taskToStart.__type === 'BUILD') {
    try {
      taskToStart.onStart()
    } catch (e) {
      logAlert(`Could not start task - ${taskToStart.description}`)
      return updateTaskQueue(element, markTaskCanceled(taskToStart))
    }
  }

  removeCrystals(taskToStart.cost.crystals)
  removeGas(taskToStart.cost.gas)
  logInfo(`Starting task - ${taskToStart.description}`)

  return {
    ...updateTaskQueue(element, markTaskBegun(taskToStart, now)),
    status: getTaskStatus(taskToStart)
  }
}
