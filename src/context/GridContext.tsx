import { createContext } from "react";
import { Grid } from "../types/common";

type GridContext = {
  grid: Grid,
  setGrid: (grid: Grid) => void
}

export const GridContext = createContext<GridContext>({
  grid: new Map(),
  setGrid: () => null
})
