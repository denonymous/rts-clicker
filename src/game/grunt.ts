import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { Grunt } from '../types/units'
import {
  GRUNT_INIT_AGGRO_RANGE,
  GRUNT_INIT_ATTACK_ACCURACY,
  GRUNT_INIT_ATTACK_DAMAGE,
  GRUNT_INIT_ATTACK_DAMAGE_RADIUS,
  GRUNT_INIT_ATTACK_RANGE,
  GRUNT_INIT_HP,
  GRUNT_INIT_MOVEMENT_SPEED
} from '../constants'
import { randomUnitName } from '../util/names'

type CreateGruntProps = {
  location: Location
}

export const createGrunt = ({ location }: CreateGruntProps): Grunt => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'UNIT',
    __unitType: 'FIGHTER',
    __type: 'GRUNT',
    __width: 1,
    __height: 1,
    location,
    status: 'Idle',
    name: `Grunt ${randomUnitName()}`,
    availableTasks: ['MOVE TO'],
    hitPoints: GRUNT_INIT_HP,
    movementSpeed: GRUNT_INIT_MOVEMENT_SPEED,
    aggroRange: GRUNT_INIT_AGGRO_RANGE,
    attackAccuracy: GRUNT_INIT_ATTACK_ACCURACY,
    attackRange: GRUNT_INIT_ATTACK_RANGE,
    attackDamage: GRUNT_INIT_ATTACK_DAMAGE,
    attackDamageRadius: GRUNT_INIT_ATTACK_DAMAGE_RADIUS,
    taskQueue: []
  }
}
