import { XY } from "../../../typeinterfaces.ts";
import { BaseRoomScene } from "../newBaseRoomScene.ts";
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
  public override getRoomId(): string {
    return CleaningRoom.sceneId;
  }
}