import { Task, TaskCost } from "../types/tasks"

/**
 * Take a timestamp of start, duration in seconds, and watermark timestamp for comparison
 * Return percentage complete of task
 * 
 * x/100=(ticks since start)/duration
 * ((ticks since start) * 100) / duration
 * (((now - startedAt) / 1_000) * 100) / duration
 */
export const calculatePercentDone = (startedAt: number, duration: number, watermark: number): number =>
  (((watermark - startedAt) / 1_000) * 100) / duration

export const canAfford = (currentResources: TaskCost, taskCost: TaskCost): boolean =>
  currentResources.crystals >= taskCost.crystals &&
  currentResources.gas >= taskCost.gas

export const markTaskBegun = (task: Task, startedAt: number): Task => ({ ...task, startedAt, status: 'IN PROGRESS' })

export const markTaskCannotAfford = (task: Task): Task => ({ ...task, status: 'NOT ENOUGH RESOURCES' })

export const markTaskDone = (task: Task, finishedAt: number): Task => ({ ...task, finishedAt, status: 'COMPLETE' })
