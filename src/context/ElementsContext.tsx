import { createContext } from 'react'
import type { Element } from '../types/elements'

type ElementsContext = {
  elements: Map<string, Element>,
  addElement: (_e: Element) => void
  addElements: (_es: readonly Element[]) => void
  updateElement: (_e: Element) => void
  updateElements: (_es: readonly Element[]) => void
  removeElement: (_e: string) => void
  removeElements: (_es: readonly string[]) => void
}

export const ElementsContext = createContext<ElementsContext>({
  elements: new Map(),
  addElement: () => null,
  addElements: () => null,
  updateElement: () => null,
  updateElements: () => null,
  removeElement: () => null,
  removeElements: () => null
})

export const buildElementsContext = (
  elements: Map<string, Element>,
  setElements: React.Dispatch<React.SetStateAction<Map<string, Element>>>
) => {
  const addElement = (element: Element) => setElements(curr => new Map(curr.set(element.__id, element)))
  const addElements = (elements: readonly Element[]) => setElements(curr => {
    elements.forEach(e => curr.set(e.__id, e))
    return new Map(curr)
  })

  const updateElement = (element: Element) => setElements(curr => new Map(curr.set(element.__id, element)))
  const updateElements = (elements: readonly Element[]) => setElements(curr => new Map(
    elements.reduce((updatedMap, element) => {
      const elementId = element.__id
      return updatedMap.has(elementId) ? updatedMap.set(element.__id, element) : updatedMap
    }, curr)
  ))

  const removeElement = (elementId: UUID) => setElements(curr => {
    curr.delete(elementId)
    return new Map(curr)
  })
  const removeElements = (elementIds: readonly UUID[]) => setElements(curr => {
    elementIds.forEach(e => curr.delete(e))
    return new Map(curr)
  })

  return {
    elements,
    addElement,
    addElements,
    updateElement,
    updateElements,
    removeElement,
    removeElements
  }
}
