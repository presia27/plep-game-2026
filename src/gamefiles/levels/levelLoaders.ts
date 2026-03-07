import { loadLevelOne } from "./levelone.ts";
import { loadLevelOneActual } from "./leveloneactual.ts";

/**
 * Ordered sequence of available levels in the game
 * This is a list of function references.
 */
export const levelLoaders = [
  loadLevelOneActual,
  loadLevelOne,
  // loadLevelOne,
  // loadLevelOne,
  // loadLevelOne
];