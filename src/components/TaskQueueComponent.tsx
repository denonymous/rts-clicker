import type { TaskQueue } from '../types/common'
import type { BuildTask, Task } from '../types/tasks'
import { calculatePercentDone } from '../util/utils'

type TaskQueueParams = {
  tasks: TaskQueue
  now: number
}

export const TaskQueueComponent = ({ tasks, now }: TaskQueueParams) => {
  return (
    <section>
      Tasks: {tasks.length ? tasks.map(task => <QueuedTaskComponent key={`QueuedTask-${task.__id}`} task={task} now={now} />) : 'none'}
    </section>
  )
}

type QueuedTaskParams = {
  task: Task
  now: number
}

export const QueuedTaskComponent = ({ task, now }: QueuedTaskParams) => {
  const statusBar =
    task.__type === 'BUILD' && task.status === 'IN PROGRESS'
      ? generateTaskStatusBar(task, now)
      : <></>

  return (
    <article key={`${task.__id}`}>
      {task.description} - {task.status} {statusBar}
    </article>
  )
}

const generateTaskStatusBar = (task: BuildTask, now: number) => {
  const percentage = task.status === 'COMPLETE'
    ? 100
    : task.status === 'QUEUED'
      ? 0
      : calculatePercentDone((task.startedAt || 0), task.duration, now)

  const displayPercentage =
    percentage < 0
      ? 0
      : percentage > 100
        ? 100
        : Math.floor(percentage)

  return (
    <article style={{ width: '200px', border: '1px solid #000', display: 'inline-block', textAlign: 'left' }}>
      <article style={{ width: `${(percentage * 2)}px`, backgroundColor: 'red', display: 'inline-block', paddingLeft: '8px' }}>{displayPercentage.toFixed(0)}%</article>
    </article>
  )
}
