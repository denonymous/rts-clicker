import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Engineer } from '../../../types/units'
import { ElementsContext } from '../../../context/ElementsContext'
import type { Resource } from '../../../types/resources'

type GatherResourceTaskButtonProps = {
  engineer: Engineer
}

export const GatherResourceTaskButton = ({ engineer }: GatherResourceTaskButtonProps) => {
  const { elements, updateElement } = useContext(ElementsContext)

  const [selectedResource, setSelectedResource] = useState<Resource | undefined>(undefined)

  const enqueueGatherResource = () => {
    const taskQueue = [
      ...engineer.taskQueue
    ]

    if (selectedResource) {
      taskQueue.push({
        __id: uuid(),
        __type: 'GATHER',
        __key: 'GATHER RESOURCE',
        phase: 'MOVING TO RESOURCE',
        cost: { crystals: 0, gas: 0 },
        description: `Gather from ${selectedResource.name}`,
        onComplete: () => { },
        targetResource: selectedResource,
        status: 'QUEUED'
      })

      updateElement({
        ...engineer,
        taskQueue
      })

      setSelectedResource(undefined)
    }
  }

  const gatherResourceOptions = [...elements.values()]
    .filter(e => e.__elementType === 'RESOURCE')
    .filter(e => e.currentValue > 0)
    .filter(e => e.__type === 'CRYSTAL PATCH' || (e.__type === 'GAS VENT' && e.refineryStatus === 'COMPLETE'))
    .map(el => (
      <option
        key={`gatherResource-${engineer.__id}-${el.__id}`}
        selected={selectedResource?.__id === el.__id}
        value={el.__id}
      >
        {el.name}
      </option>
    ))

  return (
    <>
      <button
        disabled={!selectedResource}
        onClick={() => enqueueGatherResource()}
      >
        gather resource
      </button>
      <select
        onChange={(e) => {
          const resource = elements.get(e.target.value)
          return setSelectedResource(resource?.__elementType === 'RESOURCE' ? resource : undefined)
        }}
      >
        <option>choose</option>
        {gatherResourceOptions}
      </select>
    </>
  )
}
