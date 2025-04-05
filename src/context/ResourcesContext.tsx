import { createContext } from 'react'
import { PLAYER_MAX_RESOURCE_CRYSTALS, PLAYER_MAX_RESOURCE_GAS } from '../constants'

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

export const buildResourcesContext = (
  crystals: number,
  setCrystals: React.Dispatch<React.SetStateAction<number>>,
  gas: number,
  setGas: React.Dispatch<React.SetStateAction<number>>
) => {
  const addCrystals = (val: number) => setCrystals(curr => {
    const n = curr + val
    return n > PLAYER_MAX_RESOURCE_CRYSTALS ? PLAYER_MAX_RESOURCE_CRYSTALS : n
  })
  const removeCrystals = (val: number) => setCrystals(curr => {
    const n = curr - val
    return n < 0 ? 0 : n
  })

  const addGas = (val: number) => setGas(curr => {
    const n = curr + val
    return n > PLAYER_MAX_RESOURCE_GAS ? PLAYER_MAX_RESOURCE_GAS : n
  })
  const removeGas = (val: number) => setGas(curr => {
    const n = curr - val
    return n < 0 ? 0 : n
  })

  return {
    crystals,
    addCrystals,
    removeCrystals,
    gas,
    addGas,
    removeGas
  }
}
