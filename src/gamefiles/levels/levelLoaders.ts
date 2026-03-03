import { loadLevelOne } from "./levelone.ts";

/**
 * Ordered sequence of available levels in the game
 * This is a list of function references.
 */
export const levelLoaders = [
  loadLevelOne,
  loadLevelOne,
  // loadLevelOne,
  // loadLevelOne,
  // loadLevelOne
];