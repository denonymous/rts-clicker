import { useEffect, useState } from 'react'
import './App.css'
import type { Element } from './types/elements'
import { PLAYER_MAX_RESOURCE_CRYSTALS, PLAYER_MAX_RESOURCE_GAS } from './constants'
import { CommandCentersComponent } from './components/CommandCentersComponent'
import { EngineersComponent } from './components/EngineersComponent'
import { buildResourcesContext, ResourcesContext } from './context/ResourcesContext'
import { buildElementsContext, ElementsContext } from './context/ElementsContext'
import { processTick } from './game/processTick'
import type { LogEntry, UUID } from './types/common'
import { buildLogContext, LogContext } from './context/LogContext'
import { LogComponent } from './components/LogComponent'
import { initGame } from './game/init'
import { ResourcesComponent } from './components/ResourcesComponent'

function App() {

  // log state management

  const [log, setLog] = useState<readonly LogEntry[]>([])
  const logContext = buildLogContext(log, setLog)

  // resource state management

  const [crystals, setCrystals] = useState(0)
  const [gas, setGas] = useState(0)
  const resourcesContext = buildResourcesContext(crystals, setCrystals, gas, setGas)

  // element state management

  const [elements, setElements] = useState<Map<UUID, Element>>(new Map())
  const elementsContext = buildElementsContext(elements, setElements)

  // initial game setup

  useEffect(() => initGame({ setCrystals, setGas, setElements }), [])

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick({
        currentResources: { crystals, gas },
        addCrystals: resourcesContext.addCrystals,
        removeCrystals: resourcesContext.removeCrystals,
        addGas: resourcesContext.addGas,
        removeGas: resourcesContext.removeGas,
        logInfo: logContext.logInfo,
        logAlert: logContext.logAlert,
        elements: [...elements.values()],
        updateElements: elementsContext.updateElements
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
