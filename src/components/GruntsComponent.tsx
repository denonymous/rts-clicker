import { GRUNT_INIT_HP } from '../constants'
import type { Grunt } from '../types/units'
import { TaskQueueComponent } from './TaskQueueComponent'
import { MoveToTaskButton } from './buttons/MoveToTaskButton'

export const GruntsComponent = ({ grunts }: { grunts: readonly Grunt[] }) => {
  return (
    <section>
      {grunts.map(e => <GruntComponent key={`grunt-${e.__id}`} grunt={e} />)}
    </section>
  )
}

type GruntProps = {
  grunt: Grunt
}

const GruntComponent = ({ grunt }: GruntProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{grunt.name}</strong> ({grunt.hitPoints}/{GRUNT_INIT_HP}) [{grunt.location.coords.x},{grunt.location.coords.y}]<br />
      Status: {grunt.status}<br />
      <AvailableTasksComponent grunt={grunt} />
      <TaskQueueComponent tasks={grunt.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ grunt }: GruntProps) =>
  <section>
    {
      grunt.availableTasks.map(taskKey =>
        taskKey === 'MOVE TO'
          ? <MoveToTaskButton key={`${grunt.__id}-moveToButton`} element={grunt} />
          : <></>
      )
    }
  </section>
