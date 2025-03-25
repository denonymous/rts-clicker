import { v4 as uuid } from 'uuid'
import type { Location } from '../types/common'
import type { CommandCenter } from '../types/structures'
import { COMMAND_CENTER_INIT_HP } from '../constants'
import { randomStructureName } from '../util/utils'

type CreateCommandCenterProps = {
  location: Location
}

export const createCommandCenter = ({ location }: CreateCommandCenterProps): CommandCenter => {
  const id = uuid()

  return {
    __id: id,
    __type: 'command',
    __width: 3,
    __height: 3,
    location,
    name: `Command Center ${randomStructureName()}`,
    availableTasks: ['CREATE_ENGINEER'],
    hitPoints: COMMAND_CENTER_INIT_HP,
    taskQueue: []
  }
}
