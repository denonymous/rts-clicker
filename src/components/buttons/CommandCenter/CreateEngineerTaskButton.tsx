import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { CommandCenter } from '../../../types/structures'
import { createEngineer } from '../../../tasks/engineer'
import type { BuildTask } from '../../../types/tasks'
import { BUILDER_CREATE_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'

type CreateEngineerTaskButtonProps = {
  commandCenter: CommandCenter
}

export const CreateEngineerTaskButton = ({ commandCenter }: CreateEngineerTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)

  const enqueueCreateEngineer = (commandCenter: CommandCenter) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'CREATE_ENGINEER',
      cost: BUILDER_CREATE_COST,
      description: 'Train new Engineer',
      duration: 5,
      onComplete: () => addElement(
        createEngineer({ location: commandCenter.location })
      ),
      status: 'QUEUED'
    }

    updateElement({
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
