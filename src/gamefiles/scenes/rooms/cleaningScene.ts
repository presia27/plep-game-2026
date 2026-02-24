import { XY } from "../../../typeinterfaces.ts";
import { ItemType } from "../../ordermanagement/itemTypes.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, CleaningRoom, ShelfData } from "../roomData.ts";

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
  public override getAllowedItems(): ItemType[] {
    return CleaningRoom.allowedItems;
  }
  public override getRoomId(): string {
    return CleaningRoom.sceneId;
  }
}