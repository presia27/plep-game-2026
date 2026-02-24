import { BasicLifecycle } from "../../componentLibrary/lifecycle.js";
const TIMEOUT_MS = 3000;
export class ItemLifecycle extends BasicLifecycle {
    die() {
        super.die();
        setTimeout(() => {
            super.revive();
        }, TIMEOUT_MS);
    }
}
