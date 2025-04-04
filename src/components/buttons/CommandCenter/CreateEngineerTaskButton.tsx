import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { CommandCenter } from '../../../types/structures'
import { createEngineer } from '../../../game/engineer'
import type { BuildTask } from '../../../types/tasks'
import { BUILDER_TRAINING_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type CreateEngineerTaskButtonProps = {
  commandCenter: CommandCenter
}

export const CreateEngineerTaskButton = ({ commandCenter }: CreateEngineerTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueCreateEngineer = (commandCenter: CommandCenter) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'TRAIN ENGINEER',
      cost: BUILDER_TRAINING_COST,
      description: 'Train new Engineer',
      duration: 5,
      onComplete: () => {
        const eng = createEngineer({ location: commandCenter.location })
        addElement(eng)
        logInfo(eng)(`Reporting for duty`)
      },
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
      disabled={!canAfford({ crystals, gas }, BUILDER_TRAINING_COST)}
      onClick={() => enqueueCreateEngineer(commandCenter)}
    >
      train Engineer
    </button>
  )
}
