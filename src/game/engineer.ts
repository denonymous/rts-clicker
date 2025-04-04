import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { Engineer } from '../types/units'
import {
  BUILDER_INIT_AGGRO_RANGE,
  BUILDER_INIT_ATTACK_ACCURACY,
  BUILDER_INIT_ATTACK_DAMAGE,
  BUILDER_INIT_ATTACK_DAMAGE_RADIUS,
  BUILDER_INIT_ATTACK_RANGE,
  BUILDER_INIT_BUILD_SPEED,
  BUILDER_INIT_GATHER_SPEED,
  BUILDER_INIT_HP,
  BUILDER_INIT_MOVEMENT_SPEED,
  BUILDER_INIT_REPAIR_SPEED
} from '../constants'
import { randomUnitName } from '../util/names'

type CreateEngineerProps = {
  location: Location
}

export const createEngineer = ({ location }: CreateEngineerProps): Engineer => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'UNIT',
    __unitType: 'BUILDER',
    __type: 'ENGINEER',
    __width: 1,
    __height: 1,
    location,
    status: 'Idle',
    name: `Engineer ${randomUnitName()}`,
    availableTasks: ['BUILD COMMAND CENTER', 'MOVE TO', 'GATHER RESOURCE', 'BUILD GAS REFINERY'],
    hitPoints: BUILDER_INIT_HP,
    movementSpeed: BUILDER_INIT_MOVEMENT_SPEED,
    aggroRange: BUILDER_INIT_AGGRO_RANGE,
    attackAccuracy: BUILDER_INIT_ATTACK_ACCURACY,
    attackRange: BUILDER_INIT_ATTACK_RANGE,
    attackDamage: BUILDER_INIT_ATTACK_DAMAGE,
    attackDamageRadius: BUILDER_INIT_ATTACK_DAMAGE_RADIUS,
    buildSpeed: BUILDER_INIT_BUILD_SPEED,
    repairSpeed: BUILDER_INIT_REPAIR_SPEED,
    gatherSpeed: BUILDER_INIT_GATHER_SPEED,
    taskQueue: []
  }
}
