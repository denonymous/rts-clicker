import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Barracks } from '../../../types/structures'
import { createSpecialist } from '../../../game/specialist'
import type { BuildTask } from '../../../types/tasks'
import { SPECIALIST_TRAINING_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type CreateSpecialistTaskButtonProps = {
  barracks: Barracks
}

export const CreateSpecialistTaskButton = ({ barracks }: CreateSpecialistTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueCreateSpecialist = (barracks: Barracks) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'TRAIN SPECIALIST',
      cost: SPECIALIST_TRAINING_COST,
      description: 'Train new Specialist',
      duration: 14,
      onStart: () => {},
      onComplete: () => {
        const specialist = createSpecialist({ location: barracks.location })
        addElement(specialist)
        logInfo(specialist)(`Reporting for duty`)
      },
      status: 'QUEUED'
    }

    updateElement({
      ...barracks,
      taskQueue: [
        ...barracks.taskQueue,
        task
      ]
    })
  }

  return (
    <button
      disabled={!canAfford({ crystals, gas }, SPECIALIST_TRAINING_COST)}
      onClick={() => enqueueCreateSpecialist(barracks)}
    >
      train Specialist
    </button>
  )
}
