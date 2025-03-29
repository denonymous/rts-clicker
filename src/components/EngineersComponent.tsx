// import { useContext } from 'react'
import { BUILDER_INIT_HP } from '../constants'
// import { EngineersContext } from '../context/EngineersContext'
import type { Engineer } from '../types/units'
import { TaskQueueComponent } from './TaskQueueComponent'
import { CreateCommandCenterTaskButton } from './buttons/Engineer/CreateCommandCenterTaskButton'
import { MoveToTaskButton } from './buttons/Engineer/MoveToTaskButton'

export const EngineersComponent = ({ engineers }: { engineers: readonly Engineer[] }) => {
  return (
    <section>
      {engineers.map(e => <EngineerComponent key={`engineer-${e.__id}`} engineer={e} />)}
    </section>
  )
}

type EngProps = {
  engineer: Engineer
}

const EngineerComponent = ({ engineer }: EngProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{engineer.name}</strong> ({engineer.hitPoints}/{BUILDER_INIT_HP}) [{engineer.location.coords.x},{engineer.location.coords.y}]<br />
      <AvailableTasksComponent engineer={engineer} />
      <TaskQueueComponent tasks={engineer.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ engineer }: EngProps) =>
  <section>
    {
      engineer.availableTasks.map(taskKey =>
        taskKey === 'CREATE_COMMAND_CENTER'
          ? <CreateCommandCenterTaskButton key={`${engineer.__id}-createCommandCenterButton`} engineer={engineer} />
          : taskKey === 'MOVE TO'
            ? <MoveToTaskButton key={`${engineer.__id}-moveToButton`} engineer={engineer} />
            : <></>
      )
    }
  </section>
