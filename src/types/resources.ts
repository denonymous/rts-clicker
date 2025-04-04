import type { ElementPrototype } from './common'

export type ResourcePrototype = ElementPrototype & {
  __elementType: 'RESOURCE'
  initValue: number
  currentValue: number
}

export type CrystalPatch = ResourcePrototype & {
  __type: 'CRYSTAL PATCH'
  __width: number
  __height: number
}

export type GasVent = ResourcePrototype & {
  __type: 'GAS VENT'
  __width: 2
  __height: 1
  refineryStatus: 'NONE' | 'BUILDING' | 'COMPLETE'
}

export type Resource = CrystalPatch | GasVent
