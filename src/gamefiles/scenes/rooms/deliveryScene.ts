import { XY } from "../../../typeinterfaces.ts";
import { ItemType } from "../../ordermanagement/itemTypes.ts";
import { BaseRoomScene } from "../baseRoomScene.ts";
import { DoorData, DeliveryRoom, ShelfData } from "../roomData.ts";

export class DeliveryScene extends BaseRoomScene {
  protected override getPlayerSpawnPoint(): XY {
    return DeliveryRoom.defaultSpawn;
  }
  protected override getShelfPositions(): ShelfData[] {
    return DeliveryRoom.shelves;
  }
  protected override getDoorTriggers(): DoorData[] {
    return DeliveryRoom.doors;
  }
  public override getAllowedItems(): ItemType[] {
    return DeliveryRoom.allowedItems;
  }
  public override getRoomId(): string {
    return DeliveryRoom.sceneId;
  }
  public override getDeliveryEntityPosition(): XY | null {
    const coordinates =  DeliveryRoom.deliveryEntityPosition;
    if (coordinates) {
      return coordinates;
    } else {
      return null;
    }
    
  }
}