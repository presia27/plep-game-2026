/**
 * Define additional input action types here
 * Give an enum name, followed by a string value
 */
export var InputAction;
(function (InputAction) {
    InputAction["MOVE_UP"] = "MOVE_UP";
    InputAction["MOVE_DOWN"] = "MOVE_DOWN";
    InputAction["MOVE_LEFT"] = "MOVE_LEFT";
    InputAction["MOVE_RIGHT"] = "MOVE_RIGHT";
    InputAction["PICK_UP"] = "PICK_UP";
    InputAction["DROP"] = "DROP";
    InputAction["JUMP"] = "JUMP";
    InputAction["SPRINT"] = "SPRINT";
    InputAction["ATTACK"] = "ATTACK";
})(InputAction || (InputAction = {}));
