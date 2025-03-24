import type { Element } from './common'

type Unit = Element & {
  name: string
  hitPoints: number
  movementSpeed: number
  aggroRange: number
  attackAccuracy: number
  attackRange: number
  attackDamage: number
  attackDamageRadius: number
}

type Builder = Unit & {
  buildSpeed: number
  repairSpeed: number
  gatherSpeed: number
}
export type Engineer = Builder & {
  __type: 'engineer'
  __width: 1
  __height: 1
}

type Fighter = Unit
export type Grunt = Fighter & {
  __type: 'grunt'
  __width: 1
  __height: 1
}
export type Soldier = Fighter & {
  __type: 'soldier'
  __width: 1
  __height: 1
}
export type Specialist = Fighter & {
  __type: 'specialist'
  __width: 1
  __height: 1
}
