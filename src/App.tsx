import { useEffect, useState } from 'react'
import './App.css'
import { CommandCenter } from './types/structures'
import { Engineer } from './types/units'
import { createCommandCenter } from './tasks/commandCenter'
import { Coords, Element } from './types/common'
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
import { AssignmentTask, BuildTask, Task, TaskCost, TaskQueue } from './types/tasks'
import { ResourcesContext } from './context/ResourcesContext'
import { canAfford, markTaskBegun, markTaskCannotAfford, markTaskDone } from './util/utils'

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
    const startCoords: Coords = { x: 0, y: 0 }

    setCrystals(PLAYER_INIT_RESOURCE_CRYSTALS)
    setGas(PLAYER_INIT_RESOURCE_GAS)

    setCommandCenters([
      createCommandCenter({
        location: { coords: startCoords, direction: DIRECTION_SOUTH }
      })
    ])

    setEngineers([
      createEngineer({
        location: { coords: startCoords, direction: DIRECTION_SOUTH }
      }),
      createEngineer({
        location: { coords: startCoords, direction: DIRECTION_SOUTH }
      })
    ])
  }, [])

  // tick & task queue processing

  const processBuildTask = (task: BuildTask, now: number): Task => {
    if (task.startedAt && now >= (task.startedAt + (task.duration * 1000))) {
      task.onComplete()
      return markTaskDone(task, now) as BuildTask
    }

    return task
  }

  // TODO impl
  const processAssignmentTask = (task: AssignmentTask, _now: number): Task => {
    return task
  }

  const processTaskQueue = (element: Element, currentResources: TaskCost): TaskQueue => {
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

    return element.taskQueue.map<Task>(task => {
      if (task.status === 'IN PROGRESS') {
        if (task.__type === 'BUILD') {
          return processBuildTask(task as BuildTask, now)
        }

        if (task.__type === 'ASSIGNMENT') {
          return processAssignmentTask(task as AssignmentTask, now)
        }
      }

      return task
    })
  }

  type ProcessTickInput = {
    commandCenters: readonly CommandCenter[]
    engineers: readonly Engineer[]
  }

  const processTick = ({ commandCenters, engineers }: ProcessTickInput) => {
    // check task lists and progress each one

    commandCenters.forEach(commandCenter =>
      updateCommandCenter({
        ...commandCenter,
        taskQueue: processTaskQueue(commandCenter, { crystals, gas })
      })
    )

    engineers.forEach(engineer =>
      updateEngineer({
        ...engineer,
        taskQueue: processTaskQueue(engineer, { crystals, gas })
      })
    )
  }

  // main tick loop

  useEffect(() => {
    const tick = setInterval(() => {
      processTick({ commandCenters, engineers })
    }, 1000)
    return () => clearInterval(tick)
  }, [commandCenters, engineers])

  // game board layout

  return (
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
  )
}

export default App
