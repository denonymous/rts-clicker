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
  addElement: (_e) => { },
  addElements: (_es) => { },
  updateElement: (_e) => { },
  updateElements: (_es) => { },
  removeElement: (_e: string) => { },
  removeElements: (_es: readonly string[]) => { }
})
