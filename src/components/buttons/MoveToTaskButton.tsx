import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Element } from '../../types/elements'
import { ElementsContext } from '../../context/ElementsContext'
import { LogContext } from '../../context/LogContext'
import { elementsAreInRange } from '../../util/utils'

type MoveToTaskButtonProps = {
  element: Element
}

export const MoveToTaskButton = ({ element }: MoveToTaskButtonProps) => {
  const { elements, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const [selectedElement, setSelectedElement] = useState<Element | undefined>(undefined)

  const enqueueMoveTo = () => {
    const taskQueue = [
      ...element.taskQueue
    ]
    
    if (selectedElement) {
      taskQueue.push({
        __id: uuid(),
        __type: 'MOVE',
        __key: 'MOVE TO',
        cost: { crystals: 0, gas: 0 },
        description: `Move to ${selectedElement.name}`,
        onComplete: () => logInfo(element)(`Arrived at ${selectedElement.name}`),
        targetCoords: selectedElement.location.coords,
        status: 'QUEUED'
      })

      updateElement({
        ...element,
        taskQueue
      })

      setSelectedElement(undefined)
    }
  }

  const moveToOptions = [...elements.values()]
    .filter(e => e.__id !== element.__id)
    .filter(e => !elementsAreInRange(element.location.coords, e.location.coords))
    .map(el => (
      <option
        key={`moveTo-${element.__id}-${el.__id}`}
        selected={selectedElement?.__id === el.__id}
        value={el.__id}
      >
        {el.name}
      </option>
    ))

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
        {moveToOptions}
      </select>
    </>
  )
}
