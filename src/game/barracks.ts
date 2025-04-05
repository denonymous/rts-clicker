import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { Barracks } from '../types/structures'
import { BARRACKS_INIT_HP } from '../constants'
import { randomStructureName } from '../util/names'

type CreateBarracksProps = {
  location: Location
}

export const createBarracks = ({ location }: CreateBarracksProps): Barracks => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'STRUCTURE',
    __type: 'BARRACKS',
    __width: 2,
    __height: 1,
    location,
    status: 'Idle',
    name: `Barracks ${randomStructureName()}`,
    availableTasks: ['TRAIN GRUNT', 'TRAIN SOLDIER', 'TRAIN SPECIALIST'],
    hitPoints: BARRACKS_INIT_HP,
    taskQueue: []
  }
}
