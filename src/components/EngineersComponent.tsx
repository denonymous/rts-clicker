import { BUILDER_INIT_HP } from '../constants'
import type { Engineer } from '../types/units'
import { TaskQueueComponent } from './TaskQueueComponent'
import { BuildBarracksTaskButton } from './buttons/Engineer/BuildBarracksTaskButton'
import { BuildCommandCenterTaskButton } from './buttons/Engineer/BuildCommandCenterTaskButton'
import { BuildGasRefineryTaskButton } from './buttons/Engineer/BuildGasRefineryTaskButton'
import { GatherResourceTaskButton } from './buttons/Engineer/GatherResourceTaskButton'
import { MoveToTaskButton } from './buttons/MoveToTaskButton'

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
      Status: {engineer.status}<br />
      <AvailableTasksComponent engineer={engineer} />
      <TaskQueueComponent tasks={engineer.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ engineer }: EngProps) =>
  <section>
    {
      engineer.availableTasks.map(taskKey =>
        taskKey === 'BUILD COMMAND CENTER'
          ? <BuildCommandCenterTaskButton key={`${engineer.__id}-createCommandCenterButton`} engineer={engineer} />
          : taskKey === 'MOVE TO'
            ? <MoveToTaskButton key={`${engineer.__id}-moveToButton`} element={engineer} />
            : taskKey === 'GATHER RESOURCE'
              ? <GatherResourceTaskButton key={`${engineer.__id}-gatherResourceButton`} engineer={engineer} />
              : taskKey === 'BUILD GAS REFINERY'
                ? <BuildGasRefineryTaskButton key={`${engineer.__id}-createGasRefineryButton`} engineer={engineer} />
                : taskKey === 'BUILD BARRACKS'
                  ? <BuildBarracksTaskButton key={`${engineer.__id}-createBarracksButton`} engineer={engineer} />
                  : <></>
      )
    }
  </section>
