import { XY } from "../../../typeinterfaces.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, FoodRoom, ShelfData } from "../roomData.ts";

export class FoodScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return FoodRoom.defaultSpawn;
  }
  protected override getShelfPositions(): ShelfData[] {
    return FoodRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return FoodRoom.doors;
  }
  public override getRoomId(): string {
    return FoodRoom.sceneId;
  }
}