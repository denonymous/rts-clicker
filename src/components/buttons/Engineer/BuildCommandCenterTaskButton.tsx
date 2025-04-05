import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import type { Engineer } from '../../../types/units'
import type { BuildTask } from '../../../types/tasks'
import { createCommandCenter } from '../../../game/commandCenter'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { COMMAND_CENTER_BUILDING_COST, COMMAND_CENTER_BUILDING_DURATION } from '../../../constants'
import { canAfford } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'

type BuildCommandCenterTaskButtonProps = {
  engineer: Engineer
}

export const BuildCommandCenterTaskButton = ({ engineer }: BuildCommandCenterTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const enqueueBuildCommandCenter = () => {
    const task: BuildTask = {
      __id: uuid(),
      __type: 'BUILD',
      __key: 'BUILD COMMAND CENTER',
      cost: COMMAND_CENTER_BUILDING_COST,
      description: 'Build new Command Center',
      duration: COMMAND_CENTER_BUILDING_DURATION,
      onStart: () => { },
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
      disabled={!canAfford({ crystals, gas }, COMMAND_CENTER_BUILDING_COST)}
      onClick={() => enqueueBuildCommandCenter()}
    >
      build Command Center
    </button>
  )
}
