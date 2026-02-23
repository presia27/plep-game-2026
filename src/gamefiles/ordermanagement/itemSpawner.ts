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
  private itemsByRoom: Map<string, ItemEntity[]> = new Map();

  constructor(
    sceneManager: SceneManager,
    collisionSystem: CollisionSystem,
    roomSpawnConfigs: RoomSpawnConfig[]
  ) {
    super();
    this.sceneManager = sceneManager;
    this.collisionSystem = collisionSystem;
    this.roomSpawnConfigs = roomSpawnConfigs;

    // Initialize itemsByRoom map
    for (const config of roomSpawnConfigs) {
      this.itemsByRoom.set(config.roomId, []);
    }
  }
  public getItemsForRoom(roomId: string): ItemEntity[] {
    return this.itemsByRoom.get(roomId) || [];
  }

  public override update(context: GameContext): void {
    super.update(context);

    const gameState = this.sceneManager.gameState;
    
    // while (gameState.pendingOrders.length > 0) {
    //   const order = gameState.pendingOrders[0];
    //   if (order) {
    //     this.spawnOrderItems(order);
    //     gameState.activateOrder(order);
    //   }
    // }
  }

  private spawnOrderItems(order: any): void {
    const items = this.extractItemsFromOrder(order);
    
    if (this.roomSpawnConfigs.length === 0) {
      console.error("No room spawn configs available");
      return;
    }
    
    // Distribute items across rooms
    const shuffledConfigs = this.shuffleArray([...this.roomSpawnConfigs]);
    let configIndex = 0;
    
    for (const itemType of items) {
      const config = shuffledConfigs[configIndex % shuffledConfigs.length];
      
      if (!config) continue;
      
      const availablePoints = config.spawnPoints;
      
      if (availablePoints.length > 0) {
        const randomPoint = availablePoints[Math.floor(Math.random() * availablePoints.length)];
        if (randomPoint) {
          const item = new ItemEntity(itemType, randomPoint);
          
          // Store in our map instead of pushing to scene
          this.itemsByRoom.get(config.roomId)?.push(item);
        }
      }
      
      configIndex++;
    }
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