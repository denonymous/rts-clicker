import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { Specialist } from '../types/units'
import {
  SPECIALIST_INIT_AGGRO_RANGE,
  SPECIALIST_INIT_ATTACK_ACCURACY,
  SPECIALIST_INIT_ATTACK_DAMAGE,
  SPECIALIST_INIT_ATTACK_DAMAGE_RADIUS,
  SPECIALIST_INIT_ATTACK_RANGE,
  SPECIALIST_INIT_HP,
  SPECIALIST_INIT_MOVEMENT_SPEED
} from '../constants'
import { randomUnitName } from '../util/names'

type CreateSpecialistProps = {
  location: Location
}

export const createSpecialist = ({ location }: CreateSpecialistProps): Specialist => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'UNIT',
    __unitType: 'FIGHTER',
    __type: 'SPECIALIST',
    __width: 1,
    __height: 1,
    location,
    status: 'Idle',
    name: `Specialist ${randomUnitName()}`,
    availableTasks: ['MOVE TO'],
    hitPoints: SPECIALIST_INIT_HP,
    movementSpeed: SPECIALIST_INIT_MOVEMENT_SPEED,
    aggroRange: SPECIALIST_INIT_AGGRO_RANGE,
    attackAccuracy: SPECIALIST_INIT_ATTACK_ACCURACY,
    attackRange: SPECIALIST_INIT_ATTACK_RANGE,
    attackDamage: SPECIALIST_INIT_ATTACK_DAMAGE,
    attackDamageRadius: SPECIALIST_INIT_ATTACK_DAMAGE_RADIUS,
    taskQueue: []
  }
}
