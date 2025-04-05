import { SPECIALIST_INIT_HP } from '../constants'
import type { Specialist } from '../types/units'
import { TaskQueueComponent } from './TaskQueueComponent'
import { MoveToTaskButton } from './buttons/MoveToTaskButton'

export const SpecialistsComponent = ({ specialists }: { specialists: readonly Specialist[] }) => {
  return (
    <section>
      {specialists.map(e => <SpecialistComponent key={`specialist-${e.__id}`} specialist={e} />)}
    </section>
  )
}

type SpecialistProps = {
  specialist: Specialist
}

const SpecialistComponent = ({ specialist }: SpecialistProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{specialist.name}</strong> ({specialist.hitPoints}/{SPECIALIST_INIT_HP}) [{specialist.location.coords.x},{specialist.location.coords.y}]<br />
      Status: {specialist.status}<br />
      <AvailableTasksComponent specialist={specialist} />
      <TaskQueueComponent tasks={specialist.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ specialist }: SpecialistProps) =>
  <section>
    {
      specialist.availableTasks.map(taskKey =>
        taskKey === 'MOVE TO'
          ? <MoveToTaskButton key={`${specialist.__id}-moveToButton`} element={specialist} />
          : <></>
      )
    }
  </section>
