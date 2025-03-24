import { createContext } from 'react'

type ResourcesContext = {
  crystals: number
  addCrystals: (val: number) => void
  removeCrystals: (val: number) => void
  gas: number
  addGas: (val: number) => void
  removeGas: (val: number) => void
}

export const ResourcesContext = createContext<ResourcesContext>({
  crystals: 0,
  addCrystals: () => null,
  removeCrystals: () => null,
  gas: 0,
  addGas: () => null,
  removeGas: () => null
})
