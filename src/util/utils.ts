import type { Coords, Resources } from '../types/common'
import { CommandCenter } from '../types/structures'
import type { Task } from '../types/tasks'
import type { Element } from '../types/elements'

export const getTaskStatus = (task: Task): string => {
  if (task.__type === 'BUILD' && task.__key === 'CREATE_COMMAND_CENTER') {
    return 'Building new Command Center'
  }
  else if (task.__type === 'BUILD' && task.__key === 'CREATE_ENGINEER') {
    return 'Training new Engineer'
  }
  else if (task.__type === 'MOVE') {
    return `In transit to [${task.targetCoords.x},${task.targetCoords.y}]`
  }
  else if (task.__type === 'GATHER') {
    if (task.phase === 'GATHERING RESOURCE') {
      return `Gathering from ${task.targetResource.name}`
    }
    else if (task.phase === 'MOVING TO RESOURCE') {
      return `Moving to ${task.targetResource.name}`
    }
    else if (task.phase === 'RETURNING RESOURCE') {
      return `Returning resources from ${task.targetResource.name}`
    }
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

type NearestCommandCenter = {
  nearestCommandCenter?: CommandCenter
  nearestDistance: number
}

export const findNearestCommandCenter = (coords: Coords, commandCenters: readonly CommandCenter[]) => {
  const init: NearestCommandCenter = { nearestCommandCenter: undefined, nearestDistance: Number.MAX_SAFE_INTEGER }

  return commandCenters.reduce(({ nearestCommandCenter, nearestDistance }, curr) => {
    const distanceX = curr.location.coords.x - coords.x
    const distanceY = curr.location.coords.y - coords.y
    const totalDistance = Math.abs(distanceX) + Math.abs(distanceY)

    return totalDistance < nearestDistance
      ? { nearestCommandCenter: curr, nearestDistance: totalDistance }
      : { nearestCommandCenter, nearestDistance }
  }, init)
}

export const moveElement = (element: Element, targetCoords: Coords): Element => {
  // TODO validate move
  const nextStep = calculateNextStep(element.location.coords, targetCoords)

  return {
    ...element,
    location: {
      ...element.location,
      coords: nextStep
    }
  }
}
