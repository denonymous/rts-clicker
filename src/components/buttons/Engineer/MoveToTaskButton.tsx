import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Element } from '../../../types/elements'
import type { Engineer } from '../../../types/units'
import { ElementsContext } from '../../../context/ElementsContext'

type MoveToTaskButtonProps = {
  engineer: Engineer
}

export const MoveToTaskButton = ({ engineer }: MoveToTaskButtonProps) => {
  const { elements, updateElement } = useContext(ElementsContext)

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

    updateElement({
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
      <select onChange={(e) => setSelectedElement(elements.get(e.target.value))}>
        <option>choose</option>
        {[...elements.values()].map(el => <option key={`moveTo-${engineer.__id}-${el.__id}`} value={el.__id}>{el.name}</option>)}
      </select>
    </>
  )
}
