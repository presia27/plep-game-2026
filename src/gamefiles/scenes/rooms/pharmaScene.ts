import { XY } from "../../../typeinterfaces.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, PharmaRoom, ShelfData } from "../roomData";

export class PharmaScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return PharmaRoom.defaultSpawn;
  }
  protected override getShelfPositions(): ShelfData[] {
    return PharmaRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return PharmaRoom.doors;
  }
  protected override getRoomId(): string {
    return PharmaRoom.sceneId;
  }
}