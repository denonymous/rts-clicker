import type { Coords, Resources } from '../types/common'
import type { Task } from '../types/tasks'

export const getTaskStatus = (task: Task): string => {
  if (task.__type === 'BUILD' && task.__key === 'CREATE_COMMAND_CENTER') {
    return 'Building new Command Center'
  } else if (task.__type === 'BUILD' && task.__key === 'CREATE_ENGINEER') {
    return 'Training new Engineer'
  } else if (task.__type === 'MOVE') {
    return `In transit to [${task.target.x},${task.target.y}]`
  }

  return '???'
}

/**
 * Take a timestamp of start, duration in seconds, and watermark timestamp for comparison
 * Return percentage complete of task
 * 
 * x/100=(ticks since start)/duration
 * ((ticks since start) * 100) / duration
 * (((now - startedAt) / 1_000) * 100) / duration
 */
export const calculatePercentDone = (startedAt: number, duration: number, watermark: number): number =>
  (((watermark - startedAt) / 1_000) * 100) / duration

/**
 * Return whether the given task cost can be afforded against the given resource pool
 */
export const canAfford = (currentResources: Resources, taskCost: Resources): boolean =>
  currentResources.crystals >= taskCost.crystals &&
  currentResources.gas >= taskCost.gas

/**
 * Mark a given task as having begun and return it
 */
export const markTaskBegun = <T extends Task>(task: T, startedAt: number): T => ({ ...task, startedAt, status: 'IN PROGRESS' })

/**
 * Mark a given task as having been too expensive to start and return it
 */
export const markTaskCannotAfford = <T extends Task>(task: T): T => ({ ...task, status: 'NOT ENOUGH RESOURCES' })

/**
 * Mark a given task as complete and return it
 */
export const markTaskDone = <T extends Task>(task: T, finishedAt: number): T => ({ ...task, finishedAt, status: 'COMPLETE' })

/**
 * Return whether two sets of coords are within a given range
 */
export const elementsAreInRange = (first: Coords, second: Coords, range?: number) => {
  const _range = range || 2

  return (
    first.x >= second.x - _range &&
    first.x <= second.x + _range &&
    first.y >= second.y - _range &&
    first.y <= second.y + _range
  )
}

/**
 * Take Coords of an Element looking to move and target Coords
 * 
 * Determine which axis on which the mover is further away, determine correct direction,
 * and return Coords of 1 step in a direction of the target
 */
export const calculateNextStep = (movingCoords: Coords, targetCoords: Coords) => {
  const distanceX = targetCoords.x - movingCoords.x
  const distanceY = targetCoords.y - movingCoords.y

  return Math.abs(distanceX) > Math.abs(distanceY)
    ? { x: distanceX < 0 ? movingCoords.x - 1 : movingCoords.x + 1, y: movingCoords.y }
    : { x: movingCoords.x, y: distanceY < 0 ? movingCoords.y - 1 : movingCoords.y + 1 }
}
