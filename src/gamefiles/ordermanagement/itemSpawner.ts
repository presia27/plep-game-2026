import { GameContext } from "../../classinterfaces.ts";
import { Entity } from "../../entity.ts";
import SceneManager from "../../sceneManager.ts";
import { CollisionSystem } from "../../collisionsys.ts";
import { ItemEntity } from "../ordermanagement/itemEntity.ts";
import { ItemType } from "../ordermanagement/itemTypes.ts";
import { XY } from "../../typeinterfaces.ts";


interface RoomSpawnConfig {
  roomId: string;
  spawnPoints: XY[];
}

export class ItemSpawner extends Entity {
  private sceneManager: SceneManager;
  private collisionSystem: CollisionSystem;
  private roomSpawnConfigs: RoomSpawnConfig[];

  constructor(
    sceneManager: SceneManager,
    collisionSystem: CollisionSystem,
    roomSpawnConfigs: RoomSpawnConfig[]
  ) {
    super();
    this.sceneManager = sceneManager;
    this.collisionSystem = collisionSystem;
    this.roomSpawnConfigs = roomSpawnConfigs;
  }

  public override update(context: GameContext): void {
    super.update(context);

    const gameState = this.sceneManager.gameState;
    
    while (gameState.pendingOrders.length > 0) {
      const order = gameState.pendingOrders[0];
      if (order) {
        this.spawnOrderItems(order);
        gameState.activateOrder(order);
      }
    }
  }

  private spawnOrderItems(order: any): void {
    const items = this.extractItemsFromOrder(order);
    
    const allSpawnPoints: XY[] = [];
    for (const config of this.roomSpawnConfigs) {
      allSpawnPoints.push(...config.spawnPoints);
    }

    const shuffledPoints = this.shuffleArray([...allSpawnPoints]);

    for (let i = 0; i < items.length && i < shuffledPoints.length; i++) {
      const itemType = items[i];
      const position = shuffledPoints[i];
      
      if (itemType && position) {
        this.spawnItem(itemType, position);
      }
    }
  }

  private spawnItem(itemType: ItemType, position: XY): void {
    const item = new ItemEntity(itemType, position);
    this.sceneManager.addLevelEntity(item);
    this.collisionSystem.addEntity(item);
  }

  private extractItemsFromOrder(order: any): ItemType[] {
    const items: ItemType[] = [];
    const itemMap = order.getItems();
    
    for (const [itemType, quantity] of itemMap.entries()) {
      for (let i = 0; i < quantity; i++) {
        items.push(itemType);
      }
    }
    
    return items;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
  }
}