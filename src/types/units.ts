import type { ElementPrototype } from './common'

type UnitPrototype = ElementPrototype & {
  __elementType: 'UNIT'
  name: string
  hitPoints: number
  movementSpeed: number
  aggroRange: number
  attackAccuracy: number
  attackRange: number
  attackDamage: number
  attackDamageRadius: number
}

type BuilderPrototype = UnitPrototype & {
  __unitType: 'BUILDER'
  buildSpeed: number
  repairSpeed: number
  gatherSpeed: number
}

export type Engineer = BuilderPrototype & {
  __type: 'ENGINEER'
  __width: 1
  __height: 1
}

type FighterPrototype = UnitPrototype & {
  __unitType: 'FIGHTER'
}

export type Grunt = FighterPrototype & {
  __type: 'GRUNT'
  __width: 1
  __height: 1
}

export type Soldier = FighterPrototype & {
  __type: 'SOLDIER'
  __width: 1
  __height: 1
}

export type Specialist = FighterPrototype & {
  __type: 'SPECIALIST'
  __width: 1
  __height: 1
}

export type Builder = Engineer
export type Fighter = Grunt | Soldier | Specialist
export type Unit = Builder | Fighter
