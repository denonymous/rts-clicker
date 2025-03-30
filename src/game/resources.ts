import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { CrystalPatch, GasVent } from '../types/resources'
import { CRYSTAL_PATCH_INIT_CRYSTALS, GAS_VENT_INIT_GAS, RESOURCE_INIT_HP } from '../constants'

type CreateResourceProps = {
  location: Location
}

type CreateCrystalPatchProps = CreateResourceProps & {
  width: number
  height: number
}

export const createCrystalPatch = ({ location, width, height }: CreateCrystalPatchProps): CrystalPatch => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'RESOURCE',
    __type: 'CRYSTAL PATCH',
    __width: width,
    __height: height,
    location,
    status: 'Idle',
    name: `Crystal Patch [${location.coords.x},${location.coords.y}]`,
    availableTasks: [],
    hitPoints: RESOURCE_INIT_HP,
    initValue: CRYSTAL_PATCH_INIT_CRYSTALS,
    currentValue: CRYSTAL_PATCH_INIT_CRYSTALS,
    taskQueue: []
  }
}

export const createGasVent = ({ location }: CreateResourceProps): GasVent => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'RESOURCE',
    __type: 'GAS VENT',
    __width: 2,
    __height: 1,
    location,
    status: 'Idle',
    name: `Gas Vent [${location.coords.x},${location.coords.y}]`,
    availableTasks: [],
    hitPoints: RESOURCE_INIT_HP,
    initValue: GAS_VENT_INIT_GAS,
    currentValue: GAS_VENT_INIT_GAS,
    taskQueue: []
  }
}
