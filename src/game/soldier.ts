import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { Soldier } from '../types/units'
import {
  SOLDIER_INIT_AGGRO_RANGE,
  SOLDIER_INIT_ATTACK_ACCURACY,
  SOLDIER_INIT_ATTACK_DAMAGE,
  SOLDIER_INIT_ATTACK_DAMAGE_RADIUS,
  SOLDIER_INIT_ATTACK_RANGE,
  SOLDIER_INIT_HP,
  SOLDIER_INIT_MOVEMENT_SPEED
} from '../constants'
import { randomUnitName } from '../util/names'

type CreateSoldierProps = {
  location: Location
}

export const createSoldier = ({ location }: CreateSoldierProps): Soldier => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'UNIT',
    __unitType: 'FIGHTER',
    __type: 'SOLDIER',
    __width: 1,
    __height: 1,
    location,
    status: 'Idle',
    name: `Soldier ${randomUnitName()}`,
    availableTasks: ['MOVE TO'],
    hitPoints: SOLDIER_INIT_HP,
    movementSpeed: SOLDIER_INIT_MOVEMENT_SPEED,
    aggroRange: SOLDIER_INIT_AGGRO_RANGE,
    attackAccuracy: SOLDIER_INIT_ATTACK_ACCURACY,
    attackRange: SOLDIER_INIT_ATTACK_RANGE,
    attackDamage: SOLDIER_INIT_ATTACK_DAMAGE,
    attackDamageRadius: SOLDIER_INIT_ATTACK_DAMAGE_RADIUS,
    taskQueue: []
  }
}
