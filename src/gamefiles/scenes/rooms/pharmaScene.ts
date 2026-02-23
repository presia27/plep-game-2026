import { XY } from "../../../typeinterfaces.ts";
import { BaseRoomScene } from "../newBaseRoomScene.ts";
import { DoorData, PharmaRoom, ShelfData } from "../roomData.ts";

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
  public override getRoomId(): string {
    return PharmaRoom.sceneId;
  }
}