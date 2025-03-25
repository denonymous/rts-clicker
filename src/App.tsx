import { useEffect, useState } from 'react'
import './App.css'
import { CommandCenter } from './types/structures'
import { Engineer, Unit } from './types/units'
import { createCommandCenter } from './tasks/commandCenter'
import { Coords, Element, Grid } from './types/common'
import {
  DIRECTION_SOUTH,
  PLAYER_INIT_RESOURCE_CRYSTALS,
  PLAYER_INIT_RESOURCE_GAS,
  PLAYER_MAX_RESOURCE_CRYSTALS,
  PLAYER_MAX_RESOURCE_GAS
} from './constants'
import { createEngineer } from './tasks/engineer'
import { CommandCentersContext } from './context/CommandCentersContext'
import { EngineersContext } from './context/EngineersContext'
import { CommandCentersComponent } from './components/CommandCentersComponent'
import { EngineersComponent } from './components/EngineersComponent'
import { BuildTask, MoveTask, TaskCost, TaskQueue } from './types/tasks'
import { ResourcesContext } from './context/ResourcesContext'
import { calculateNextStep, canAfford, elementsAreInRange, findElementOnGrid, generateGridFromMove, markTaskBegun, markTaskCannotAfford, markTaskDone, placeElementOnGrid } from './util/utils'
import { GridContext } from './context/GridContext'

function App() {

  const xRadius = 80
  const yRadius = 80

  const [grid, setGrid] = useState<Grid>(new Map())

  const gridContext = {
    grid,
    setGrid
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

  // structure state management

  const [commandCenters, setCommandCenters] = useState([] as readonly CommandCenter[])

  const addCommandCenter = (commandCenter: CommandCenter) =>
    setCommandCenters(curr => [...curr, commandCenter])

  const updateCommandCenter = (commandCenter: CommandCenter) =>
    setCommandCenters(curr => [
      ...curr.filter(cc => cc.__id !== commandCenter.__id),
      commandCenter
    ])

  const removeCommandCenter = (id: string) =>
    setCommandCenters(curr => [...curr.filter(cc => cc.__id !== id)])

  const commandCentersContext = {
    commandCenters,
    addCommandCenter,
    updateCommandCenter,
    removeCommandCenter
  }

  // unit state management

  const [engineers, setEngineers] = useState([] as readonly Engineer[])

  const addEngineer = (engineer: Engineer) =>
    setEngineers(curr => [...curr, engineer])

  const updateEngineer = (engineer: Engineer) =>
    setEngineers(curr => [
      ...curr.filter(e => e.__id !== engineer.__id),
      engineer
    ])

  const removeEngineer = (id: string) =>
    setEngineers(curr => [...curr.filter(e => e.__id !== id)])

  const engineersContext = {
    engineers,
    addEngineer,
    updateEngineer,
    removeEngineer
  }

  // set initial game start state

  useEffect(() => {
    let grid = Array.from<number>({ length: (xRadius * 2) + 1 })
      .reduce<Grid>((acc, _, xIdx) => {
        Array.from<number>({ length: (yRadius * 2) + 1 })
          .forEach((_, yIdx) =>
            acc.set(
              JSON.stringify({ x: xIdx - xRadius, y: yIdx - yRadius }),
              new Set()
            )
          )

        return acc
      }, new Map())

    setCrystals(PLAYER_INIT_RESOURCE_CRYSTALS)
    setGas(PLAYER_INIT_RESOURCE_GAS)

    // TODO this is gross, clean it up

    const initialCommandCenter = createCommandCenter({
      location: { coords: { x: 0, y: 0 }, direction: DIRECTION_SOUTH }
    })
    setCommandCenters([initialCommandCenter])
    const ccResults = placeElementOnGrid(grid, initialCommandCenter, { x: 0, y: 0 })
    grid = ccResults.success ? ccResults.grid : grid

    const e1 = createEngineer({
      location: { coords: { x: -10, y: -7 }, direction: DIRECTION_SOUTH }
    })
    const e2 = createEngineer({
      location: { coords: { x: 8, y: -16 }, direction: DIRECTION_SOUTH }
    })
    setEngineers([e1, e2])
    const e1Results = placeElementOnGrid(grid, e1, { x: -10, y: -7 })
    grid = e1Results.success ? e1Results.grid : grid
    const e2Results = placeElementOnGrid(grid, e2, { x: 8, y: -16 })
    grid = e2Results.success ? e2Results.grid : grid

    setGrid(grid)
  }, [])

  // tick & task queue processing

  const processBuildTask = (task: BuildTask, now: number): BuildTask => {
    if (task.startedAt && now >= (task.startedAt + (task.duration * 1000))) {
      task.onComplete()
      return markTaskDone(task, now) as BuildTask
    }

    return task
  }

  const processMoveTask = (grid: Grid, unit: Unit, task: MoveTask, now: number): { task: MoveTask, grid: Grid } => {
    const unitGridEntry = findElementOnGrid(grid, unit)
    const targetGridEntry = findElementOnGrid(grid, task.target)

    if (!unitGridEntry || !targetGridEntry) {
      return { grid, task }
    }

    const unitCoords: Coords = JSON.parse(unitGridEntry[0])
    const targetCoords: Coords = JSON.parse(targetGridEntry[0])

    if (elementsAreInRange(unitCoords, targetCoords)) {
      task.onComplete()
      return { grid, task: markTaskDone(task, now) }
    }

    const nextStep = calculateNextStep(unitCoords, targetCoords)
    const result = generateGridFromMove(grid, nextStep, unit)

    if (result.success) {
      return { grid: result.grid, task }
    } else {
      return { grid, task }
    }
  }

  const processTaskQueue = (grid: Grid, element: Element, currentResources: TaskCost): TaskQueue => {
    const now = new Date().getTime()

    const tasksInProgress = element.taskQueue.reduce((acc, curr) => curr.status === 'IN PROGRESS' ? acc + 1 : acc, 0)

    if (!tasksInProgress) {
      const taskToStart = element.taskQueue.find(task => !['IN PROGRESS', 'COMPLETE'].includes(task.status))

      if (taskToStart) {
        if (canAfford(currentResources, taskToStart.cost)) {
          removeCrystals(taskToStart.cost.crystals)
          removeGas(taskToStart.cost.gas)

          return [
            ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
            markTaskBegun(taskToStart, now)
          ]
        } else {
          return [
            ...element.taskQueue.filter(task => task.__id !== taskToStart.__id),
            markTaskCannotAfford(taskToStart)
          ]
        }
      }
    }

    return element.taskQueue.map<BuildTask | MoveTask>(task => {
      if (task.status === 'IN PROGRESS') {
        if (task.__type === 'BUILD') {
          return processBuildTask(task as BuildTask, now)
        }

        if (task.__type === 'MOVE') {
          const { grid: updatedGrid, task: updatedTask } = processMoveTask(grid, element as Unit, task as MoveTask, now)
          setGrid(updatedGrid)
          return updatedTask
        }
      }

      return task
    })
  }

  type ProcessTickInput = {
    grid: Grid
    commandCenters: readonly CommandCenter[]
    engineers: readonly Engineer[]
  }

  const processTick = ({ grid, commandCenters, engineers }: ProcessTickInput) => {
    // check task lists and progress each one

    commandCenters.forEach(commandCenter =>
      updateCommandCenter({
        ...commandCenter,
        taskQueue: processTaskQueue(grid, commandCenter, { crystals, gas })
      })
    )

    engineers.forEach(engineer =>
      updateEngineer({
        ...engineer,
        taskQueue: processTaskQueue(grid, engineer, { crystals, gas })
      })
    )
  }

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick({ grid, commandCenters, engineers })
    }, 1000)
    return () => clearInterval(tick)
  }, [grid, commandCenters, engineers])

  // game board layout

  return (
    <GridContext.Provider value={gridContext}>
      <ResourcesContext.Provider value={resourcesContext}>
        <CommandCentersContext.Provider value={commandCentersContext}>
          <EngineersContext.Provider value={engineersContext}>
            <h2>Resources</h2>
            Crystals: {crystals}/{PLAYER_MAX_RESOURCE_CRYSTALS}, Gas: {gas}/{PLAYER_MAX_RESOURCE_GAS}
            <h2>Structures</h2>
            <CommandCentersComponent />
            <h2>Units</h2>
            <EngineersComponent />
          </EngineersContext.Provider>
        </CommandCentersContext.Provider>
      </ResourcesContext.Provider>
    </GridContext.Provider>
  )
}

export default App
