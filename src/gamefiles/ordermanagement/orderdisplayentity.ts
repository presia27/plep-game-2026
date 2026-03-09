import { Entity } from "../../entity.ts";
import { OrderDisplayRenderer } from "./orderdisplayrenderer.ts";
import { OrderDeliveryLoop } from "./orderloopsys.ts";

/**
 * Entity container for rendering on-screen
 */
export class OrderDisplayEntity extends Entity {
  constructor(x: number, y: number, orderLoop: OrderDeliveryLoop, getLevelNumber: () => number) {
    super();
    const renderer = new OrderDisplayRenderer(x, y, orderLoop, getLevelNumber);
    this.setRenderer(renderer);
  }
}