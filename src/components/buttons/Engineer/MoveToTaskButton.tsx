import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CommandCentersContext } from '../../../context/CommandCentersContext'
import { EngineersContext } from '../../../context/EngineersContext'
import { Element } from '../../../types/common'
import { Engineer } from '../../../types/units'

type MoveToTaskButtonProps = {
  engineer: Engineer
}

export const MoveToTaskButton = ({ engineer }: MoveToTaskButtonProps) => {
  const { updateEngineer } = useContext(EngineersContext)
  const { commandCenters } = useContext(CommandCentersContext)

  const [selectedElement, setSelectedElement] = useState<Element | undefined>(undefined)

  const enqueueMoveTo = () => {
    const taskQueue = [
      ...engineer.taskQueue
    ]
    selectedElement && taskQueue.push({
      __id: uuid(),
      __type: 'MOVE',
      __key: 'MOVE TO',
      cost: { crystals: 0, gas: 0 },
      description: `Move to ${selectedElement.name}`,
      onComplete: () => { },
      target: selectedElement,
      status: 'QUEUED'
    })

    updateEngineer({
      ...engineer,
      taskQueue
    })
  }

  return (
    <>
      <button
        disabled={!selectedElement}
        onClick={() => enqueueMoveTo()}
      >
        move to
      </button>
      <select onChange={(e) => setSelectedElement(commandCenters.find(cc => cc.__id === e.target.value))}>
        <option>choose</option>
        {commandCenters.map(cc => <option value={cc.__id}>{cc.name}</option>)}
      </select>
    </>
  )
}
