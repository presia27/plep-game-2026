import { XY } from "../../../typeinterfaces.ts";
import { ItemType } from "../../ordermanagement/itemTypes.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, FoodRoom, ShelfData } from "../roomData.ts";

export class FoodScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return FoodRoom.defaultSpawn;
  }
  protected override getMonsterSpawnPoints(): XY[] {
    return FoodRoom.monsterSpawns;
  }
  protected override getUpdatePoints(): XY[] {
    return FoodRoom.updatePoints;
  }
  protected override getShelfPositions(): ShelfData[] {
    return FoodRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return FoodRoom.doors;
  }
  public override getAllowedItems(): ItemType[] {
    return FoodRoom.allowedItems;
  }
  public override getRoomId(): string {
    return FoodRoom.sceneId;
  }
}