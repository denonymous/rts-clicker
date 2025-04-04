import type { ElementPrototype } from './common'

export type StructurePrototype = ElementPrototype & {
  __elementType: 'STRUCTURE'
}

export type CommandCenter = StructurePrototype & {
  __type: 'COMMAND CENTER'
  __width: 3
  __height: 3
}

export type Barracks = StructurePrototype & {
  __type: 'BARRACKS'
  __width: 2
  __height: 1
}

export type GasRefinery = StructurePrototype & {
  __type: 'GAS REFINERY'
  __width: 2
  __height: 1
}

export type Structure = CommandCenter | Barracks | GasRefinery
