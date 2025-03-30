import { useEffect, useState } from 'react'
import './App.css'
import { createCommandCenter } from './tasks/commandCenter'
import type { Element } from './types/elements'
import {
  DIRECTION_SOUTH,
  PLAYER_MAX_RESOURCE_CRYSTALS,
  PLAYER_MAX_RESOURCE_GAS
} from './constants'
import { createEngineer } from './tasks/engineer'
import { CommandCentersComponent } from './components/CommandCentersComponent'
import { EngineersComponent } from './components/EngineersComponent'
import { ResourcesContext } from './context/ResourcesContext'
import { ElementsContext } from './context/ElementsContext'
import { processTick } from './game/processTick'
import type { UUID } from './types/common'

function App() {

  // resource state management

  const [crystals, setCrystals] = useState(0)
  const [gas, setGas] = useState(0)

  const addCrystals = (val: number) => setCrystals(curr => {
    const n = curr + val
    return n > PLAYER_MAX_RESOURCE_CRYSTALS ? PLAYER_MAX_RESOURCE_CRYSTALS : n
  })
  const removeCrystals = (val: number) => setCrystals(curr => {
    const n = curr - val
    return n < 0 ? 0 : n
  })

  const addGas = (val: number) => setGas(curr => {
    const n = curr + val
    return n > PLAYER_MAX_RESOURCE_GAS ? PLAYER_MAX_RESOURCE_GAS : n
  })
  const removeGas = (val: number) => setGas(curr => {
    const n = curr - val
    return n < 0 ? 0 : n
  })

  const resourcesContext = {
    crystals,
    addCrystals,
    removeCrystals,
    gas,
    addGas,
    removeGas
  }

  const [elements, setElements] = useState<Map<UUID, Element>>(new Map())

  const addElement = (element: Element) => setElements(curr => new Map(curr.set(element.__id, element)))
  const addElements = (elements: readonly Element[]) => setElements(curr => {
    elements.forEach(e => curr.set(e.__id, e))
    return new Map(curr)
  })

  const updateElement = (element: Element) => setElements(curr => new Map(curr.set(element.__id, element)))
  const updateElements = (elements: readonly Element[]) => setElements(curr => new Map(
    elements.reduce((updatedMap, element) => {
      const elementId = element.__id
      return updatedMap.has(elementId) ? updatedMap.set(element.__id, element) : updatedMap
    }, curr)
  ))

  const removeElement = (elementId: UUID) => setElements(curr => {
    curr.delete(elementId)
    return new Map(curr)
  })
  const removeElements = (elementIds: readonly UUID[]) => setElements(curr => {
    elementIds.forEach(e => curr.delete(e))
    return new Map(curr)
  })

  const elementsContext = {
    elements,
    addElement,
    addElements,
    updateElement,
    updateElements,
    removeElement,
    removeElements
  }

  // initial game setup

  useEffect(() => {
    setCrystals(1000)
    setGas(1000)

    const initialCommandCenter = createCommandCenter({
      location: { coords: { x: 0, y: 0 }, direction: DIRECTION_SOUTH }
    })

    const engineer1 = createEngineer({
      location: { coords: { x: -10, y: -7 }, direction: DIRECTION_SOUTH }
    })

    const engineer2 = createEngineer({
      location: { coords: { x: 8, y: -16 }, direction: DIRECTION_SOUTH }
    })

    setElements(
      [
        initialCommandCenter,
        engineer1,
        engineer2
      ].reduce((acc, curr) => acc.set(curr.__id, curr), new Map())
    )
  }, [])

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick({
        currentResources: { crystals, gas },
        removeCrystals,
        removeGas,
        elements: [...elements.values()],
        updateElements
      })
    }, 1000)
    return () => clearInterval(tick)
  })

  // game board layout

  return (
    <ResourcesContext.Provider value={resourcesContext}>
      <ElementsContext.Provider value={elementsContext}>
        <h2>Resources</h2>
        Crystals: {crystals}/{PLAYER_MAX_RESOURCE_CRYSTALS}, Gas: {gas}/{PLAYER_MAX_RESOURCE_GAS}
        <h2>Structures</h2>
        <CommandCentersComponent commandCenters={[...elements.values()].filter(e => e.__type === 'COMMAND CENTER')} />
        <h2>Units</h2>
        <EngineersComponent engineers={[...elements.values()].filter(e => e.__type === 'ENGINEER')} />
      </ElementsContext.Provider>
    </ResourcesContext.Provider>
  )
}

export default App
