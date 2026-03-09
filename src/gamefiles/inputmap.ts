import { InputMapValue } from "../typeinterfaces.ts";
import { InputAction } from "../inputactionlist.ts";

export const myInputMap: InputMapValue[] = [
  { type: "key", value: "w", action: InputAction.MOVE_UP },
  { type: "key", value: "a", action: InputAction.MOVE_LEFT },
  { type: "key", value: "s", action: InputAction.MOVE_DOWN },
  { type: "key", value: "d", action: InputAction.MOVE_RIGHT },
  { type: "key", value: "e", action: InputAction.PICK_UP },
  { type: "key", value: "q", action: InputAction.DROP },
  { type: "key", value: "f", action: InputAction.FULFILL },
  { type: "key", value: "space", action: InputAction.JUMP },
  { type: "key", value: "1", action: InputAction.INVENTORY1 },
  { type: "key", value: "2", action: InputAction.INVENTORY2 },
  { type: "key", value: "3", action: InputAction.INVENTORY3 },
  { type: "key", value: "4", action: InputAction.INVENTORY4 },
  { type: "key", value: "5", action: InputAction.INVENTORY5 },
  { type: "key", value: "6", action: InputAction.INVENTORY6 },
  { type: "key", value: "escape", action: InputAction.PAUSE }
]
