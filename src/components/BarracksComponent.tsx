import type { Barracks } from '../types/structures'
import { BARRACKS_INIT_HP } from '../constants'
import { TaskQueueComponent } from './TaskQueueComponent'
import { CreateGruntTaskButton } from './buttons/Barracks/CreateGruntTaskButton'
import { CreateSoldierTaskButton } from './buttons/Barracks/CreateSoldierTaskButton'
import { CreateSpecialistTaskButton } from './buttons/Barracks/CreateSpecialistTaskButton'

export const BarracksesComponent = ({ barrackses }: { barrackses: readonly Barracks[] }) => {
  return (
    <section>
      {
        barrackses.map(bar => <BarracksComponent barracks={bar} key={`bar-${bar.__id}`} />)
      }
    </section>
  )
}

type BarProps = {
  barracks: Barracks
}

const BarracksComponent = ({ barracks }: BarProps) => {
  const now = new Date().getTime()

  return (
    <article>
      <strong>{barracks.name}</strong> ({barracks.hitPoints}/{BARRACKS_INIT_HP}) [{barracks.location.coords.x},{barracks.location.coords.y}]<br />
      Status: {barracks.status}<br />
      <AvailableTasksComponent barracks={barracks} />
      <TaskQueueComponent tasks={barracks.taskQueue} now={now} />
    </article>
  )
}

const AvailableTasksComponent = ({ barracks }: BarProps) =>
  <section>
    {
      barracks.availableTasks.map(taskKey =>
        taskKey === 'TRAIN GRUNT'
          ? <CreateGruntTaskButton key={`${barracks.__id}-createGruntButton`} barracks={barracks} />
          : taskKey === 'TRAIN SOLDIER'
            ? <CreateSoldierTaskButton key={`${barracks.__id}-createSoldierButton`} barracks={barracks} />
            : taskKey === 'TRAIN SPECIALIST'
              ? <CreateSpecialistTaskButton key={`${barracks.__id}-createSpecialistButton`} barracks={barracks} />
              : <></>
      )
    }
  </section>
