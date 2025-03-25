import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { CommandCentersContext } from '../../../context/CommandCentersContext'
import { CommandCenter } from '../../../types/structures'
import { EngineersContext } from '../../../context/EngineersContext'
import { createEngineer } from '../../../tasks/engineer'
import { BuildTask } from '../../../types/tasks'
import { BUILDER_CREATE_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'

type CreateEngineerTaskButtonProps = {
  commandCenter: CommandCenter
}

export const CreateEngineerTaskButton = ({ commandCenter }: CreateEngineerTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addEngineer } = useContext(EngineersContext)
  const { updateCommandCenter } = useContext(CommandCentersContext)

  const enqueueCreateEngineer = (commandCenter: CommandCenter) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'CREATE_ENGINEER',
      cost: BUILDER_CREATE_COST,
      description: 'Train new Engineer',
      duration: 5,
      onComplete: () => addEngineer(
        createEngineer({ location: commandCenter.location })
      ),
      status: 'QUEUED'
    }

    updateCommandCenter({
      ...commandCenter,
      taskQueue: [
        ...commandCenter.taskQueue,
        task
      ]
    })
  }

  return (
    <button
      disabled={!canAfford({ crystals, gas }, BUILDER_CREATE_COST)}
      onClick={() => enqueueCreateEngineer(commandCenter)}
    >
      train Engineer
    </button>
  )
}
