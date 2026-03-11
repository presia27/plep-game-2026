/**
 * Vehicle type definitions for the vehicle movement system
 * Each vehicle corresponds to a frame in VehicleSpritesheet.png
 * @author Emma
 */

/**
 * Available vehicle types in the game.
 */
export enum VehicleType {
  // clean vehicles
  CTRUCK1 = "CTRUCK1",
  CTRUCK2 = "CTRUCK2",
  CVAN1 = "CVAN1",
  CVAN2 = "CVAN2",
  CCAR1 = "CCAR1",

  BTRUCK1 = "BTRUCK1",
  BTRUCK2 = "BTRUCK2",
  BVAN1 = "BVAN1",
  BVAN2 = "BVAN2",
  BCAR1 = "BCAR1",
  BCAR2 = "BCAR2"
}

/**
 * Metadata for each vehicle type
 */
export interface VehicleMetadata {
  type: VehicleType;
  number: number;
  name: string;
  spriteFrameX: number;
  spriteFrameY: number;
  spriteWidth: number;
  spriteHeight: number;
}

/**
 * All available vehicles with their metadata
 */
export const ALL_VEHICLES: VehicleMetadata[] = [
  // clean vehicles
  { type: VehicleType.CTRUCK1, number: 1,  name: "CTRUCK1", spriteFrameX: 1, spriteFrameY: 1,   spriteWidth: 61, spriteHeight: 28 },
  { type: VehicleType.CTRUCK2, number: 2,  name: "CTRUCK2", spriteFrameX: 1, spriteFrameY: 31,  spriteWidth: 61, spriteHeight: 28 },
  { type: VehicleType.CVAN1,   number: 3,  name: "CVAN1",   spriteFrameX: 1, spriteFrameY: 61,  spriteWidth: 60, spriteHeight: 29 },
  { type: VehicleType.CVAN2,   number: 4,  name: "CVAN2",   spriteFrameX: 1, spriteFrameY: 92,  spriteWidth: 60, spriteHeight: 29 },
  { type: VehicleType.CCAR1,   number: 5,  name: "CCAR1",   spriteFrameX: 1, spriteFrameY: 123, spriteWidth: 60, spriteHeight: 30 },
  // bloody vehicles
  { type: VehicleType.BTRUCK1, number: 6,  name: "BTRUCK1", spriteFrameX: 1, spriteFrameY: 155, spriteWidth: 61, spriteHeight: 28 },
  { type: VehicleType.BTRUCK2, number: 7,  name: "BTRUCK2", spriteFrameX: 1, spriteFrameY: 185, spriteWidth: 61, spriteHeight: 29 },
  { type: VehicleType.BVAN1,   number: 8,  name: "BVAN1",   spriteFrameX: 1, spriteFrameY: 216, spriteWidth: 60, spriteHeight: 29 },
  { type: VehicleType.BVAN2,   number: 9,  name: "BVAN2",   spriteFrameX: 1, spriteFrameY: 247, spriteWidth: 61, spriteHeight: 30 },
  { type: VehicleType.BCAR1,   number: 10, name: "BCAR1",   spriteFrameX: 1, spriteFrameY: 279, spriteWidth: 60, spriteHeight: 30 },
  { type: VehicleType.BCAR2,   number: 11, name: "BCAR2",   spriteFrameX: 1, spriteFrameY: 311, spriteWidth: 60, spriteHeight: 30 }
]

/**
 * Get vehicle metadata by vehicle NUMBER
 */
export function getVehicleMetadata(vehicleNum: number): VehicleMetadata {
  const vehicle = ALL_VEHICLES.find(vehicle => vehicle.number === vehicleNum);
  if (!vehicle) {
    console.warn(`Vehicle number ${vehicleNum} not found, returning default`);
    return { type: VehicleType.CTRUCK1, number: 1, name: "Unknown", spriteFrameX: 1, spriteFrameY: 1, spriteWidth: 61, spriteHeight: 28};
  }
  return vehicle;
}
