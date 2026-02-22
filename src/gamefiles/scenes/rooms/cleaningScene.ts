import { XY } from "../../../typeinterfaces.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, CleaningRoom, ShelfData } from "../roomData";

export class CleaningScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return CleaningRoom.defaultSpawn;
  }
  protected override getShelfPositions(): ShelfData[] {
    return CleaningRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return CleaningRoom.doors;
  }
  protected override getRoomId(): string {
    return CleaningRoom.sceneId;
  }
}