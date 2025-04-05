import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Barracks } from '../../../types/structures'
import { createGrunt } from '../../../game/grunt'
import type { BuildTask } from '../../../types/tasks'
import { GRUNT_TRAINING_COST } from '../../../constants'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type CreateGruntTaskButtonProps = {
  barracks: Barracks
}

export const CreateGruntTaskButton = ({ barracks }: CreateGruntTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueCreateGrunt = (barracks: Barracks) => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'TRAIN GRUNT',
      cost: GRUNT_TRAINING_COST,
      description: 'Train new Grunt',
      duration: 8,
      onStart: () => {},
      onComplete: () => {
        const grunt = createGrunt({ location: barracks.location })
        addElement(grunt)
        logInfo(grunt)(`Reporting for duty`)
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
      disabled={!canAfford({ crystals, gas }, GRUNT_TRAINING_COST)}
      onClick={() => enqueueCreateGrunt(barracks)}
    >
      train Grunt
    </button>
  )
}
