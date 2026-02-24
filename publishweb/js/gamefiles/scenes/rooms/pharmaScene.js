import { BaseRoomScene } from "../baseRoomScene.js";
import { PharmaRoom } from "../roomData.js";
export class PharmaScene extends BaseRoomScene {
    getPlayerSpawnPoint() {
        return PharmaRoom.defaultSpawn;
    }
    getShelfPositions() {
        return PharmaRoom.shelves;
    }
    getDoorTriggers() {
        return PharmaRoom.doors;
    }
    getAllowedItems() {
        return PharmaRoom.allowedItems;
    }
    getRoomId() {
        return PharmaRoom.sceneId;
    }
}
