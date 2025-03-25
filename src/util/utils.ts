import { structures, units } from "../names"
import { Coords, Element, ErrorCode, Grid } from "../types/common"
import { Task, TaskCost } from "../types/tasks"

export const randomStructureName = () =>
  structures[Math.floor(Math.random() * structures.length)]

export const randomUnitName = () =>
  units[Math.floor(Math.random() * units.length)]

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

export const canAfford = (currentResources: TaskCost, taskCost: TaskCost): boolean =>
  currentResources.crystals >= taskCost.crystals &&
  currentResources.gas >= taskCost.gas

export const markTaskBegun = <T extends Task>(task: T, startedAt: number): T => ({ ...task, startedAt, status: 'IN PROGRESS' })

export const markTaskCannotAfford = <T extends Task>(task: T): T => ({ ...task, status: 'NOT ENOUGH RESOURCES' })

export const markTaskDone = <T extends Task>(task: T, finishedAt: number): T => ({ ...task, finishedAt, status: 'COMPLETE' })

export const findElementOnGrid = (grid: Grid, element: Element) =>
  Array.from(grid.entries()).find(([_, elementIds]) => elementIds.has(element.__id))

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
 * Determine which axis mover is further on, determine correct direction,
 * and return Coords of 1 step in a direction of the target
 */
export const calculateNextStep = (movingCoords: Coords, targetCoords: Coords) => {
  const distanceX = targetCoords.x - movingCoords.x
  const distanceY = targetCoords.y - movingCoords.y

  return Math.abs(distanceX) > Math.abs(distanceY)
    ? { x: distanceX < 0 ? movingCoords.x - 1 : movingCoords.x + 1, y: movingCoords.y }
    : { x: movingCoords.x, y: distanceY < 0 ? movingCoords.y - 1 : movingCoords.y + 1 }
}

export const placeElementOnGrid = (grid: Grid, element: Element, target: Coords): { grid: Grid, success: true } | { errorCode: ErrorCode, grid: Grid, success: false } => {
  const targetIsValid = isValidMoveTarget(grid, target)
  if (!targetIsValid.success) {
    return {
      errorCode: targetIsValid.errorCode,
      grid,
      success: false
    }
  }

  const _target = JSON.stringify(target)

  return {
    grid: grid
      .set(_target, targetIsValid.value.add(element.__id)),
    success: true
  }
}


export const generateGridFromMove = (grid: Grid, target: Coords, element: Element): { grid: Grid, success: true } | { errorCode: ErrorCode, grid: Grid, success: false } => {
  const _target = JSON.stringify(target)

  const targetIsValid = isValidMoveTarget(grid, target)
  if (!targetIsValid.success) {
    return {
      errorCode: targetIsValid.errorCode,
      grid,
      success: false
    }
  }

  const originEntry = Array.from(grid.entries()).find(([_, elementIds]) => elementIds.has(element.__id))

  if (!originEntry) {
    return {
      errorCode: 'ELEMENT_NOT_ON_GRID',
      grid,
      success: false
    }
  }

  const originElementIds = originEntry[1]
  originElementIds.delete(element.__id)

  return {
    grid: grid
      .set(originEntry[0], originElementIds)
      .set(_target, targetIsValid.value.add(element.__id)),
    success: true
  }
}

const isValidMoveTarget = (grid: Grid, coords: Coords): { success: true, value: Set<string> } | { errorCode: ErrorCode, success: false } => {
  const gridEntry = grid.get(JSON.stringify(coords))

  if (!gridEntry) {
    return {
      errorCode: 'INVALID_GRID_COORDS',
      success: false
    }
  }

  return {
    success: true,
    value: new Set(gridEntry.values())
  }
}
