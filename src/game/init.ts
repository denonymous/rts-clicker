import { DIRECTION_SOUTH } from '../constants'
import { createCommandCenter } from './commandCenter'
import { createEngineer } from './engineer'
import type { Element } from '../types/elements'
import type { UUID } from '../types/common'
import { createCrystalPatch, createGasVent } from './resources'

type InitGameProps = {
  setCrystals: (val: number) => void
  setGas: (val: number) => void
  setElements: (elements: Map<UUID, Element>) => void
}

export const initGame = ({ setCrystals, setGas, setElements }: InitGameProps) => {
  setCrystals(1000)
  setGas(1000)

  const commandCenter = createCommandCenter({
    location: { coords: { x: 0, y: 0 }, direction: DIRECTION_SOUTH }
  })

  const engineer1 = createEngineer({
    location: { coords: { x: -10, y: -7 }, direction: DIRECTION_SOUTH }
  })

  const engineer2 = createEngineer({
    location: { coords: { x: 8, y: -16 }, direction: DIRECTION_SOUTH }
  })

  const crystalPatch1 = createCrystalPatch({
    location: { coords: { x: 20, y: 14 }, direction: DIRECTION_SOUTH },
    width: 4,
    height: 1
  })

  const gasVent1 = createGasVent({
    location: { coords: { x: -9, y: 13 }, direction: DIRECTION_SOUTH }
  })

  setElements(
    [
      commandCenter,
      engineer1,
      engineer2,
      crystalPatch1,
      gasVent1
    ].reduce((acc, curr) => acc.set(curr.__id, curr), new Map())
  )

}