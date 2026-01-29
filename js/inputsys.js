/**
 * Reads input from peripheral devices
 */
export class InputSystem {
    constructor(ctx, inputMap, debug) {
        this.ctx = ctx;
        this.debug = debug;
        this.leftClick = null;
        this.rightClick = null;
        this.cursor = null;
        this.wheel = null;
        this.keyStates = new Map();
        this.keyBindings = new Map();
        // initialize keybindings
        inputMap.filter((item) => item.type === "key")
            .forEach((filteredItem) => this.keyBindings.set(filteredItem.value, filteredItem.action));
        this.startInput();
    }
    /**
     * Updates the key state of the given key.
     * Set your event handler to call this method
     * when a key is pressed down.
     * @param key Keyboard key string value
     */
    handleKeyDown(key) {
        const state = this.keyStates.get(key) || { isPressed: false, justPressed: false, justReleased: false };
        if (!state.isPressed) {
            state.justPressed = true;
        }
        state.isPressed = true;
        state.justReleased = false;
        this.keyStates.set(key, state);
    }
    /**
     * Updates the key state of the given key.
     * Set you event handler to call this method
     * when a key is released.
     * @param key Keyboard key string value
     */
    handleKeyUp(key) {
        const state = this.keyStates.get(key) || { isPressed: false, justPressed: false, justReleased: false };
        state.isPressed = false;
        state.justPressed = false;
        state.justReleased = true;
        this.keyStates.set(key, state);
    }
    /**
     * Clears certain states with each game time update
     */
    onFrameUpdate() {
        // Clear just-pressed and just-released flags each frame
        this.keyStates.forEach((state) => {
            state.justPressed = false;
            state.justReleased = false;
        });
    }
    /**
     * Query whether an action is present based on current peripheral input.
     * Use this for continuous input.
     *
     * @param action InputAction parameter, indicating an action state to query.
     * @returns Boolean of whether that action is currently being communicated by the user.
     */
    isActionActive(action) {
        for (const [key, boundAction] of this.keyBindings) {
            if (boundAction === action) {
                const currentState = this.keyStates.get(key);
                return (currentState === null || currentState === void 0 ? void 0 : currentState.isPressed) || false;
            }
        }
        return false;
    }
    /**
     * Query whether an action is present based on current peripheral input.
     * Use this for non-continuous input, such as when something should happen
     * only once with a key press, mouse click, etc. If a key is held down, it
     * will only be registered once.
     *
     * @param action InputAction parameter, indicating the action state to query.
     * @returns Boolean of whether the action is currently being communicated by the user.
     */
    isActionActiveSingle(action) {
        for (const [key, boundAction] of this.keyBindings) {
            if (boundAction === action) {
                const state = this.keyStates.get(key);
                return (state === null || state === void 0 ? void 0 : state.justPressed) || false;
            }
        }
        return false;
    }
    startInput() {
        const getXandY = (e) => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.debug) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.cursor = getXandY(e);
        });
        this.ctx.canvas.addEventListener("click", e => {
            if (this.debug) {
                console.log("CLICK", getXandY(e));
            }
            this.leftClick = getXandY(e);
        });
        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.debug) {
                console.log("WHEEL", getXandY(e), e.deltaX, e.deltaY);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });
        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.debug) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightClick = getXandY(e);
        });
        this.ctx.canvas.addEventListener("keydown", event => this.handleKeyDown(event.key.toLowerCase()));
        this.ctx.canvas.addEventListener("keyup", event => this.handleKeyUp(event.key.toLowerCase()));
    }
    set debugState(dbg) {
        this.debug = dbg;
    }
}
