import { BUILDER_GATHER_CRYSTALS_AMT, BUILDER_GATHER_GAS_AMT } from '../constants'
import type { Element } from '../types/elements'
import { Resource } from '../types/resources'
import { CommandCenter } from '../types/structures'
import type { GatherTask } from '../types/tasks'
import {
  elementsAreInRange,
  findNearestCommandCenter,
  getTaskStatus,
  moveElement,
} from '../util/utils'

type GatherTaskParams = {
  logAlert: (message: string) => void
  addCrystals: (val: number) => void
  addGas: (val: number) => void
  commandCenters: readonly CommandCenter[]
  resources: readonly Resource[]
  element: Element
  task: GatherTask
  now: number
}

type GatherTaskReturn = {
  updatedElement?: Element
  additionalUpdatedElements?: readonly Element[]
  updatedTask?: GatherTask
}

export const processGatherTask = ({ logAlert, addCrystals, addGas, commandCenters, resources, element, task, now }: GatherTaskParams): GatherTaskReturn => {
  const resource = resources.find(res => res.__id === task.targetResource.__id)

  if (!resource) {
    logAlert(`Cannot find resource on map`)

    return {
      updatedElement: {
        ...element,
        status: 'Cannot find Resource on map'
      },
      updatedTask: {
        ...task,
        status: 'CANCELED'
      }
    }
  }

  if (task.phase === 'MOVING TO RESOURCE') {
    if (elementsAreInRange(element.location.coords, task.targetResource.location.coords)) {
      const updatedTask: GatherTask = {
        ...task,
        targetResource: resource,
        phase: 'GATHERING RESOURCE',
        phaseStartedAt: now
      }

      return {
        updatedElement: {
          ...element,
          status: getTaskStatus(updatedTask)
        },
        updatedTask
      }
    }

    return {
      updatedElement: moveElement(element, task.targetResource.location.coords)
    }
  }

  else if (task.phase === 'GATHERING RESOURCE' && element.__type === 'ENGINEER') {
    if (
      (resource.__type === 'CRYSTAL PATCH' && resource.currentValue < BUILDER_GATHER_CRYSTALS_AMT) ||
      (resource.__type === 'GAS VENT' && resource.currentValue < BUILDER_GATHER_GAS_AMT)
    ) {
      const updatedTask: GatherTask = {
        ...task,
        status: 'COMPLETE'
      }

      logAlert(`${resource.name} has been exhausted of material`)

      return { updatedTask }
    }

    if (resource.__type === 'GAS VENT' && resource.refineryStatus !== 'COMPLETE') {
      const updatedTask: GatherTask = {
        ...task,
        status: 'CANCELED'
      }

      logAlert(`${resource.name} does not have a Gas Refinery, cannot gather`)

      return { updatedTask }
    }

    if (task.phaseStartedAt && now >= (task.phaseStartedAt + (element.gatherSpeed * 1000))) {
      const updatedResource = {
        ...resource,
        currentValue: resource.currentValue - (
          resource.__type === 'CRYSTAL PATCH'
            ? BUILDER_GATHER_CRYSTALS_AMT
            : resource.__type === 'GAS VENT'
              ? BUILDER_GATHER_GAS_AMT
              : 0
        )
      }

      const updatedTask: GatherTask = {
        ...task,
        targetResource: updatedResource,
        phase: 'RETURNING RESOURCE',
        phaseStartedAt: now
      }

      return {
        updatedElement: {
          ...element,
          status: getTaskStatus(updatedTask)
        },
        additionalUpdatedElements: [updatedResource],
        updatedTask
      }
    }

    // no-op
    return {}
  }

  else if (task.phase === 'RETURNING RESOURCE' && element.__type === 'ENGINEER') {
    const { nearestCommandCenter } = findNearestCommandCenter(element.location.coords, commandCenters)

    if (!nearestCommandCenter) {
      logAlert('Cannot find Command Center to return resources')

      return {
        updatedElement: {
          ...element,
          status: 'Cannot find Command Center to return resources'
        },
        updatedTask: {
          ...task,
          status: 'CANCELED'
        }
      }
    }

    if (elementsAreInRange(element.location.coords, nearestCommandCenter.location.coords)) {
      if (task.targetResource.__type === 'CRYSTAL PATCH') {
        addCrystals(BUILDER_GATHER_CRYSTALS_AMT)
      }
      else if (task.targetResource.__type === 'GAS VENT') {
        addGas(BUILDER_GATHER_GAS_AMT)
      }

      const updatedTask: GatherTask = {
        ...task,
        targetResource: resource,
        phase: 'MOVING TO RESOURCE',
        phaseStartedAt: now
      }

      return {
        updatedElement: {
          ...element,
          status: getTaskStatus(updatedTask)
        },
        updatedTask
      }
    }

    return {
      updatedElement: moveElement(element, nearestCommandCenter.location.coords)
    }
  }

  // no-op
  return {}
}
