import { useContext } from 'react'
import { CommandCentersContext } from '../context/CommandCentersContext'
import { CommandCenter } from '../types/structures'
import { COMMAND_CENTER_INIT_HP } from '../constants'
import { TaskQueueComponent } from './TaskQueueComponent'
import { CreateEngineerTaskButton } from './buttons/CommandCenter/CreateEngineerTaskButton'

export const CommandCentersComponent = () => {
  const { commandCenters } = useContext(CommandCentersContext)

  return (
    <section>
      {
        commandCenters.map(cc => <CommandCenterComponent commandCenter={cc} key={`cc-${cc.__id}`} />)
      }
    </section>
  )
}

type CCProps = {
  commandCenter: CommandCenter
}

const CommandCenterComponent = ({ commandCenter }: CCProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{commandCenter.name}</strong> ({commandCenter.hitPoints}/{COMMAND_CENTER_INIT_HP})<br />
      <AvailableTasksComponent commandCenter={commandCenter} />
      <TaskQueueComponent tasks={commandCenter.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ commandCenter }: CCProps) =>
  <section>
    {
      commandCenter.availableTasks.map(taskKey =>
        taskKey === 'CREATE_ENGINEER'
          ? <CreateEngineerTaskButton key={`${commandCenter.__id}-createEngineerButton`} commandCenter={commandCenter} />
          : <></>
      )
    }
  </section>
