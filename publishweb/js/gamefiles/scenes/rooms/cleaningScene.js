import { BaseRoomScene } from "../baseRoomScene.js";
import { CleaningRoom } from "../roomData.js";
export class CleaningScene extends BaseRoomScene {
    getPlayerSpawnPoint() {
        return CleaningRoom.defaultSpawn;
    }
    getShelfPositions() {
        return CleaningRoom.shelves;
    }
    getDoorTriggers() {
        return CleaningRoom.doors;
    }
    getAllowedItems() {
        return CleaningRoom.allowedItems;
    }
    getRoomId() {
        return CleaningRoom.sceneId;
    }
}
