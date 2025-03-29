import { useEffect, useState } from 'react'
import './App.css'
import { createCommandCenter } from './tasks/commandCenter'
import { Resources } from './types/common'
import type { Element } from './types/elements'
import {
  DIRECTION_SOUTH,
  PLAYER_MAX_RESOURCE_CRYSTALS,
  PLAYER_MAX_RESOURCE_GAS
} from './constants'
import { createEngineer } from './tasks/engineer'
import { CommandCentersComponent } from './components/CommandCentersComponent'
import { EngineersComponent } from './components/EngineersComponent'
import { BuildTask, MoveTask } from './types/tasks'
import { ResourcesContext } from './context/ResourcesContext'
import {
  calculateNextStep,
  canAfford,
  elementsAreInRange,
  markTaskBegun,
  markTaskCannotAfford,
  markTaskDone
} from './util/utils'
import { ElementsContext } from './context/ElementsContext'

function App() {

  const xRadius = 80
  const yRadius = 80

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

  type UUID = string

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

    setElements([initialCommandCenter, engineer1, engineer2].reduce((acc, curr) => acc.set(curr.__id, curr), new Map()))
  }, [])

  const processBuildTask = (task: BuildTask, now: number): BuildTask => {
    if (task.startedAt && now >= (task.startedAt + (task.duration * 1000))) {
      task.onComplete()
      return markTaskDone(task, now) as BuildTask
    }

    return task
  }

  const processMoveTask = (element: Element, task: MoveTask, now: number): { element: Element, task: MoveTask } => {
    const elementLocation = element.location
    const targetLocation = elements.get(task.target.__id)?.location

    if (!elementLocation || !targetLocation) {
      // TODO log error
      return { element, task }
    }

    if (elementsAreInRange(elementLocation.coords, targetLocation.coords)) {
      task.onComplete()
      return { element, task: markTaskDone(task, now) }
    }

    const nextStep = calculateNextStep(elementLocation.coords, targetLocation.coords)
    // TODO validate move
    element.location.coords = nextStep

    return { element, task }
  }

  /**
   * Process an element's task queue for a tick
   * 
   * If it has no tasks in progress, try to start one.
   * 
   * Return element with updated data (task queue, location, etc)
   */
  const processTaskQueue = (element: Element, currentResources: Resources, now: number): Element => {

    const tasksInProgress = element.taskQueue.reduce((acc, curr) => curr.status === 'IN PROGRESS' ? acc + 1 : acc, 0)

    if (!tasksInProgress) {
      const taskToStart = element.taskQueue.find(task => !['IN PROGRESS', 'COMPLETE'].includes(task.status))

      if (taskToStart) {
        if (canAfford(currentResources, taskToStart.cost)) {
          removeCrystals(taskToStart.cost.crystals)
          removeGas(taskToStart.cost.gas)

          element.taskQueue = [
            ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
            markTaskBegun(taskToStart, now)
          ]
        } else {
          element.taskQueue = [
            ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
            markTaskCannotAfford(taskToStart)
          ]
        }
      }
    }

    const updatedElement = element.taskQueue.reduce((updatedElement, task) => {
      if (task.status === 'IN PROGRESS') {
        if (task.__type === 'BUILD') {
          const updatedTask = processBuildTask(task, now)
          return {
            ...updatedElement,
            taskQueue: [
              ...updatedElement.taskQueue.filter(_task => _task.__id !== task.__id),
              updatedTask
            ]
          }
        }

        if (task.__type === 'MOVE') {
          const { element: processedElement, task: updatedTask } = processMoveTask(updatedElement, task, now)
          return {
            ...processedElement,
            taskQueue: [
              ...processedElement.taskQueue.filter(_task => _task.__id !== task.__id),
              updatedTask
            ]
          }
        }
      }

      return updatedElement
    }, { ...element })

    return updatedElement
  }

  const processTick = (elements: readonly Element[]) => {
    const now = new Date().getTime()

    const updatedElements = elements.map(e => processTaskQueue(e, { crystals, gas }, now))
    updateElements(updatedElements)
  }

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick([...elements.values()])
    }, 1000)
    return () => clearInterval(tick)
  }, [elements])

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
