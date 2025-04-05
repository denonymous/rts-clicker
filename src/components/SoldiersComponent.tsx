import { SOLDIER_INIT_HP } from '../constants'
import type { Soldier } from '../types/units'
import { TaskQueueComponent } from './TaskQueueComponent'
import { MoveToTaskButton } from './buttons/MoveToTaskButton'

export const SoldiersComponent = ({ soldiers }: { soldiers: readonly Soldier[] }) => {
  return (
    <section>
      {soldiers.map(e => <SoldierComponent key={`soldier-${e.__id}`} soldier={e} />)}
    </section>
  )
}

type SoldierProps = {
  soldier: Soldier
}

const SoldierComponent = ({ soldier }: SoldierProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{soldier.name}</strong> ({soldier.hitPoints}/{SOLDIER_INIT_HP}) [{soldier.location.coords.x},{soldier.location.coords.y}]<br />
      Status: {soldier.status}<br />
      <AvailableTasksComponent soldier={soldier} />
      <TaskQueueComponent tasks={soldier.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ soldier }: SoldierProps) =>
  <section>
    {
      soldier.availableTasks.map(taskKey =>
        taskKey === 'MOVE TO'
          ? <MoveToTaskButton key={`${soldier.__id}-moveToButton`} element={soldier} />
          : <></>
      )
    }
  </section>
