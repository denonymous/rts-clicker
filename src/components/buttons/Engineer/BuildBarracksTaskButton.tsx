import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Engineer } from '../../../types/units'
import type { BuildTask } from '../../../types/tasks'
import { createBarracks } from '../../../game/barracks'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { BARRACKS_BUILDING_COST, BARRACKS_BUILDING_DURATION } from '../../../constants'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type BuildBarracksTaskButtonProps = {
  engineer: Engineer
}

export const BuildBarracksTaskButton = ({ engineer }: BuildBarracksTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueBuildBarracks = () => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'BUILD BARRACKS',
      cost: BARRACKS_BUILDING_COST,
      description: 'Build new Barracks',
      duration: BARRACKS_BUILDING_DURATION,
      onStart: () => { },
      onComplete: () => {
        const cc = createBarracks({ location: engineer.location })
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
      disabled={!canAfford({ crystals, gas }, BARRACKS_BUILDING_COST)}
      onClick={() => enqueueBuildBarracks()}
    >
      build Barracks
    </button>
  )
}
