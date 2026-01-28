import { InputMapValue } from "../typeinterfaces.ts";
import { InputAction } from "../inputactionlist.ts";

export const myInputMap: InputMapValue[] = [
  { type: "key", value: "w", action: InputAction.MOVE_UP },
  { type: "key", value: "a", action: InputAction.MOVE_LEFT },
  { type: "key", value: "s", action: InputAction.MOVE_DOWN },
  { type: "key", value: "d", action: InputAction.MOVE_RIGHT },
  { type: "key", value: "e", action: InputAction.PICK_UP },
  { type: "key", value: "q", action: InputAction.DROP },
  { type: "key", value: "space", action: InputAction.JUMP }
]
