import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Engineer } from '../../../types/units'
import type { BuildTask } from '../../../types/tasks'
import { createCommandCenter } from '../../../tasks/commandCenter'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { COMMAND_CENTER_CREATE_COST } from '../../../constants'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type CreateCommandCenterTaskButtonProps = {
  engineer: Engineer
}

export const CreateCommandCenterTaskButton = ({ engineer }: CreateCommandCenterTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueCreateCommandCenter = (engineer: Engineer) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'CREATE_COMMAND_CENTER',
      cost: COMMAND_CENTER_CREATE_COST,
      description: 'Build new Command Center',
      duration: 30,
      onComplete: () => {
        const cc = createCommandCenter({ location: engineer.location })
        addElement(cc)
        logInfo(cc)(`Built and ready for action`)
      },
      status: 'QUEUED'
    }

    updateElement({
      ...engineer,
      taskQueue: [
        ...engineer.taskQueue,
        task
      ]
    })
  }

  return (
    <button
      disabled={!canAfford({ crystals, gas }, COMMAND_CENTER_CREATE_COST)}
      onClick={() => enqueueCreateCommandCenter(engineer)}
    >
      build Command Center
    </button>
  )
}
