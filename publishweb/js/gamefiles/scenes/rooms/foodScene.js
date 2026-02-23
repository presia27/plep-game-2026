import { BaseRoomScene } from "../baseRoomScene.js";
import { FoodRoom } from "../roomData.js";
export class FoodScene extends BaseRoomScene {
    getPlayerSpawnPoint() {
        return FoodRoom.defaultSpawn;
    }
    getShelfPositions() {
        return FoodRoom.shelves;
    }
    getDoorTriggers() {
        return FoodRoom.doors;
    }
    getAllowedItems() {
        return FoodRoom.allowedItems;
    }
    getRoomId() {
        return FoodRoom.sceneId;
    }
}
