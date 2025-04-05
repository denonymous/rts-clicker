import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Barracks } from '../../../types/structures'
import { createSoldier } from '../../../game/soldier'
import type { BuildTask } from '../../../types/tasks'
import { SOLDIER_TRAINING_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type CreateSoldierTaskButtonProps = {
  barracks: Barracks
}

export const CreateSoldierTaskButton = ({ barracks }: CreateSoldierTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueCreateSoldier = (barracks: Barracks) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'TRAIN SOLDIER',
      cost: SOLDIER_TRAINING_COST,
      description: 'Train new Soldier',
      duration: 10,
      onStart: () => {},
      onComplete: () => {
        const soldier = createSoldier({ location: barracks.location })
        addElement(soldier)
        logInfo(soldier)(`Reporting for duty`)
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
      disabled={!canAfford({ crystals, gas }, SOLDIER_TRAINING_COST)}
      onClick={() => enqueueCreateSoldier(barracks)}
    >
      train Soldier
    </button>
  )
}
