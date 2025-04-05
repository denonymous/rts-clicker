import { useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Engineer } from '../../../types/units'
import { createGasRefinery } from '../../../game/gasRefinery'
import { ResourcesContext } from '../../../context/ResourcesContext'
import { GAS_REFINERY_BUILDING_COST, GAS_REFINERY_BUILDING_DURATION } from '../../../constants'
import { canAfford, elementsAreInRange } from '../../../util/utils'
import { ElementsContext } from '../../../context/ElementsContext'
import { LogContext } from '../../../context/LogContext'
import type { GasVent } from '../../../types/resources'

type BuildGasRefineryTaskButtonProps = {
  engineer: Engineer
}

export const BuildGasRefineryTaskButton = ({ engineer }: BuildGasRefineryTaskButtonProps) => {
  const { crystals, gas } = useContext(ResourcesContext)
  const { elements, addElement, updateElement } = useContext(ElementsContext)
  const { logInfo } = useContext(LogContext)

  const [selectedGasVent, setSelectedGasVent] = useState<GasVent | undefined>(undefined)

  const enqueueBuildGasRefinery = () => {
    const taskQueue = [
      ...engineer.taskQueue
    ]

    if (selectedGasVent) {
      if (!elementsAreInRange(engineer.location.coords, selectedGasVent.location.coords)) {
        taskQueue.push({
          __id: uuid(),
          __type: 'MOVE',
          __key: 'MOVE TO',
          cost: { crystals: 0, gas: 0 },
          description: `Move to ${selectedGasVent.name}`,
          onComplete: () => logInfo(engineer)(`Arrived at ${selectedGasVent.name}`),
          targetCoords: selectedGasVent.location.coords,
          status: 'QUEUED'
        })
      }

      taskQueue.push({
        __id: uuid(),
        __type: 'BUILD',
        __key: 'BUILD GAS REFINERY',
        cost: GAS_REFINERY_BUILDING_COST,
        description: 'Build new Gas Refinery',
        duration: GAS_REFINERY_BUILDING_DURATION,
        onStart: () => {
          if (selectedGasVent.refineryStatus !== 'NONE') {
            throw new Error(`Gas Refinery already exists at ${selectedGasVent.name}`)
          }

          updateElement({
            ...selectedGasVent,
            refineryStatus: 'BUILDING'
          })
        },
        onComplete: () => {
          const cc = createGasRefinery({ gasVent: selectedGasVent })
          addElement(cc)
          updateElement({
            ...selectedGasVent,
            refineryStatus: 'COMPLETE'
          })
          logInfo(cc)(`Built and ready for action`)
        },
        status: 'QUEUED'
      })

      updateElement({
        ...engineer,
        taskQueue
      })

      setSelectedGasVent(undefined)
    }
  }

  const gasVentOptions = [...elements.values()]
    .filter(e => e.__type === 'GAS VENT' && e.refineryStatus === 'NONE')
    .map(el => (
      <option
        key={`buildGasRefinery-${engineer.__id}-${el.__id}`}
        selected={selectedGasVent?.__id === el.__id}
        value={el.__id}
      >
        {el.name}
      </option>
    ))

  return (
    <>
      <button
        disabled={!canAfford({ crystals, gas }, GAS_REFINERY_BUILDING_COST) && !!gasVentOptions.length}
        onClick={() => enqueueBuildGasRefinery()}
      >
        build Gas Refinery
      </button>
      <select
        onChange={(e) => {
          const gasVent = elements.get(e.target.value)
          return setSelectedGasVent(gasVent?.__type === 'GAS VENT' ? gasVent : undefined)
        }}
      >
        <option>choose</option>
        {gasVentOptions}
      </select>
    </>
  )
}
