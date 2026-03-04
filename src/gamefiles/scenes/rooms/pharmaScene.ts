import { XY } from "../../../typeinterfaces.ts";
import { ItemType } from "../../ordermanagement/itemTypes.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, PharmaRoom, ShelfData } from "../roomData.ts";

export class PharmaScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return PharmaRoom.defaultSpawn;
  }
  protected override getMonsterSpawnPoints(): XY[] {
    return PharmaRoom.monsterSpawns;
  }
  protected override getUpdatePoints(): XY[] {
    return PharmaRoom.updatePoints;
  }
  protected override getShelfPositions(): ShelfData[] {
    return PharmaRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return PharmaRoom.doors;
  }
  public override getAllowedItems(): ItemType[] {
    return PharmaRoom.allowedItems;
  }
  public override getRoomId(): string {
    return PharmaRoom.sceneId;
  }
  public override getDeliveryEntityPosition(): XY | null {
    return null;
  }
}