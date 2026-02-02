/**
 * Game timer
 * Original Comment: This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
 *
 * @author Preston Sia, KV Le, Chris Marriott, Seth Ladd
 */
export class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    }
    /**
     * Calculates and returns the amount of time since the last game tick up
     * to the value of maxStep.
     */
    tick() {
        const current = Date.now();
        const delta = (current - this.lastTimestamp) / 1000; // Calculate the delta in seconds
        this.lastTimestamp = current;
        const gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    }
    /**
     * Returns the total game time in seconds.
     * @returns Game time in seconds
     */
    getGameTime() {
        return this.gameTime;
    }
}
