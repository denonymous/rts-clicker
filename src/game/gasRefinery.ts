import { v4 as uuid } from 'uuid'
import type { GasRefinery } from '../types/structures'
import { GAS_REFINERY_INIT_HP } from '../constants'
import { randomStructureName } from '../util/names'
import type { GasVent } from '../types/resources'

type CreateGasRefineryProps = {
  gasVent: GasVent
}

export const createGasRefinery = ({ gasVent }: CreateGasRefineryProps): GasRefinery => {
  const id = uuid()

  return {
    __id: id,
    __elementType: 'STRUCTURE',
    __type: 'GAS REFINERY',
    __width: 2,
    __height: 1,
    location: gasVent.location,
    status: 'Idle',
    name: `Gas Refinery ${randomStructureName()}`,
    availableTasks: [],
    hitPoints: GAS_REFINERY_INIT_HP,
    taskQueue: []
  }
}
