import { InputAction } from "./inputactionlist.ts";

/**
 * Allowed asset types, primarily "img" for images,
 * "audio" for audio files, and "other" for
 * everything else.
 */
export type AssetTypes = "img" | "audio" | "other";

/**
 * Schema of a user-defined list of assets.
 * Each asset needs an ID to identify the asset
 * easily, a type (see AssetTypes), and a file
 * location.
 */
export interface IAssetList {
  id: string;
  type: AssetTypes;
  location: string;
}

/**
 * Represents an object with an X and Y coordinate
 */
export interface XY {
  x: number;
  y: number;
}

/**
 * A vector representing a velocity
 * with a magnitude (speed) and
 * direction vector.
 */
export interface VelocityCommand {
  direction: XY;
  magnitude: number;
}

/**
 * Types of peripheral input,
 * mainly "key" for keyboard input
 * and "mouseClick" for mouse
 * clicks.
 */
type inputType = "key" | "mouseClick";

/**
 * A user-defined mapping of peripheral inputs
 * to a set of actions defined in inputactionlist.ts.
 */
export interface InputMapValue {
  type: inputType;
  value: string;
  action: InputAction;
}
