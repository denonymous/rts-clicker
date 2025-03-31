import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import './App.css'
import type { Element } from './types/elements'
import { PLAYER_MAX_RESOURCE_CRYSTALS, PLAYER_MAX_RESOURCE_GAS } from './constants'
import { CommandCentersComponent } from './components/CommandCentersComponent'
import { EngineersComponent } from './components/EngineersComponent'
import { ResourcesContext } from './context/ResourcesContext'
import { ElementsContext } from './context/ElementsContext'
import { processTick } from './game/processTick'
import type { LogEntry, UUID } from './types/common'
import { LogContext } from './context/LogContext'
import { LogComponent } from './components/LogComponent'
import { initGame } from './game/init'
import { ResourcesComponent } from './components/ResourcesComponent'

function App() {

  // log state management

  const [log, setLog] = useState<readonly LogEntry[]>([])

  const logMessage = (level: LogEntry['level'], element: Element, message: string) => setLog(curr => [
    ...curr,
    {
      __id: uuid(),
      level,
      timestamp: new Date().getTime(),
      writtenBy: element.__id,
      message: `${element.name}: ${message}`
    }
  ])
  const logInfo = (element: Element) => (message: string) => logMessage('INFO', element, message)
  const logAlert = (element: Element) => (message: string) => logMessage('ALERT', element, message)

  const logContext = {
    log,
    logInfo,
    logAlert
  }

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

  // element state management

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

  useEffect(() => initGame({ setCrystals, setGas, setElements }), [])

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick({
        currentResources: { crystals, gas },
        addCrystals,
        removeCrystals,
        addGas,
        removeGas,
        logInfo,
        logAlert,
        elements: [...elements.values()],
        updateElements
      })
    }, 1000)
    return () => clearInterval(tick)
  })

  // game board layout

  return (
    <ResourcesContext.Provider value={resourcesContext}>
      <LogContext.Provider value={logContext}>
        <ElementsContext.Provider value={elementsContext}>
          <h2>Resources</h2>
          Crystals: {crystals}/{PLAYER_MAX_RESOURCE_CRYSTALS}, Gas: {gas}/{PLAYER_MAX_RESOURCE_GAS}
          <h2>Structures</h2>
          <CommandCentersComponent commandCenters={[...elements.values()].filter(e => e.__type === 'COMMAND CENTER')} />
          <h2>Units</h2>
          <EngineersComponent engineers={[...elements.values()].filter(e => e.__type === 'ENGINEER')} />
          <h2>Resources</h2>
          <ResourcesComponent resources={[...elements.values()].filter(e => e.__elementType === 'RESOURCE')} />
          <h2>Log</h2>
          <LogComponent />
        </ElementsContext.Provider>
      </LogContext.Provider>
    </ResourcesContext.Provider>
  )
}

export default App
