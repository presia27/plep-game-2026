import { IPosition, ISize } from "../../classinterfaces.ts"
import { BoundingBox } from "../../componentLibrary/boundingBox.ts";
import { StaticSpriteRenderer } from "../../componentLibrary/staticSpriteRenderer.ts";

export class DeliveryRenderer extends StaticSpriteRenderer {
  constructor(
    image: HTMLImageElement,
    spriteXstart: number,
    spriteYstart: number,
    spriteWidth: number,
    spriteHeight: number,
    positionComponent: IPosition,
    sizeComponent: ISize,
    boundingBox?: BoundingBox | null

  ) {
    super(image,
      spriteXstart,
      spriteYstart,
      spriteWidth,
      spriteHeight,
      positionComponent,
      sizeComponent,
      boundingBox);
  }
}