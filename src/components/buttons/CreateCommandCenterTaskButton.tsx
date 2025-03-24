import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { EngineersContext } from '../../context/EngineersContext'
import { Engineer } from '../../types/units'
import { CommandCentersContext } from '../../context/CommandCentersContext'
import { BuildTask } from '../../types/tasks'
import { createCommandCenter } from '../../tasks/commandCenter'
import { ResourcesContext } from '../../context/ResourcesContext'
import { COMMAND_CENTER_CREATE_COST } from '../../constants'
import { canAfford } from '../../util/utils'

type CreateCommandCenterTaskButtonProps = {
  engineer: Engineer
}

export const CreateCommandCenterTaskButton = ({ engineer }: CreateCommandCenterTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { updateEngineer } = useContext(EngineersContext)
  const { addCommandCenter } = useContext(CommandCentersContext)

  const enqueueCreateCommandCenter = (engineer: Engineer) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'CREATE_COMMAND_CENTER',
      cost: COMMAND_CENTER_CREATE_COST,
      description: 'Build new Command Center',
      duration: 30,
      onComplete: () => addCommandCenter(
        createCommandCenter({ location: engineer.location })
      ),
      status: 'QUEUED'
    }

    updateEngineer({
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
