import type { Element } from './common'

export type Structure = Element & {}

export type CommandCenter = Structure & {
  __type: 'command'
  __width: 3
  __height: 3
}

export type Barracks = Structure & {
  __type: 'barracks'
  __width: 2
  __height: 2
}
