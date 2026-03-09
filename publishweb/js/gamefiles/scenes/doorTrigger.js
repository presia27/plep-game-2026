import { BoundingBox } from "../../componentLibrary/boundingBox.js";
import { BasicSize } from "../../componentLibrary/BasicSize.js";
import { MovementComponent } from "../../componentLibrary/movementComponent.js";
import { Entity } from "../../entity.js";
import { DoorTriggerCollisionHandler } from "./doorTriggerCollisionHandler.js";
import { DoorDirection } from "./roomData.js";
import { ASSET_MANAGER } from "../main.js";
///revise///
const ARROW_SIDE_LENGTH = 9;
const ARROW_SPRITE_XSTART = [1, 12, 23, 34];
const ARROW_SPRITE_YSTART = 1;
/**
 * An invisible trigger zone placed at a doorway.
 * When the player's bounding box overlaps this trigger,
 * the SceneManager is told to load the target scene.
 *
 * Place these at doorways in each room via getDoorTriggers()
 * in your BaseRoomScene subclass.
 *
 * @author Luke Willis, Claude Sonnet 4.5
 */
export class DoorTrigger extends Entity {
    constructor(position, size, targetSceneId, direction, sceneManager, playerBoundingBox) {
        super();
        this.targetSceneId = targetSceneId;
        this.sceneManager = sceneManager;
        this.playerBoundingBox = playerBoundingBox;
        this.direction = direction;
        // invisible trigger zone — no renderer needed
        const movement = new MovementComponent(position);
        const boundSize = new BasicSize(size.x, size.y, 1);
        this.boundingBox = new BoundingBox(movement, boundSize, 0, 0);
        this.collisionHandler = new DoorTriggerCollisionHandler(sceneManager, targetSceneId);
        super.addComponent(movement);
        super.addComponent(this.boundingBox);
        super.addComponent(this.collisionHandler);
        const arrowSprite = ASSET_MANAGER.getImageAsset("arrow");
        if (arrowSprite === null) {
            throw new Error("Failed to load asset for arrows");
        }
        this.arrowSprite = arrowSprite;
    }
    update(context) {
    }
    draw(context) {
        var _a, _b, _c;
        super.draw(context);
        const ctx = context.ctx;
        ctx.save();
        const spriteXStart = (_a = ARROW_SPRITE_XSTART[this.direction]) !== null && _a !== void 0 ? _a : 1;
        const drawSideLength = ARROW_SIDE_LENGTH * 2;
        if (this.direction === DoorDirection.DOWN || this.direction === DoorDirection.UP) {
            // Draw a series of horizontal arrows
            const xdraws = [
                this.boundingBox.getLeft(),
                (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2 - (drawSideLength / 2),
                this.boundingBox.getRight() - drawSideLength
            ];
            for (let i = 0; i < xdraws.length; i++) {
                ctx.drawImage(this.arrowSprite, spriteXStart, ARROW_SPRITE_YSTART, ARROW_SIDE_LENGTH, ARROW_SIDE_LENGTH, (_b = xdraws[i]) !== null && _b !== void 0 ? _b : this.boundingBox.getLeft(), this.boundingBox.getTop(), drawSideLength, drawSideLength);
            }
        }
        else {
            // Draw a series of vertical arrows
            const ydraws = [
                this.boundingBox.getTop(),
                (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2 - (drawSideLength / 2),
                this.boundingBox.getBottom() - drawSideLength
            ];
            for (let i = 0; i < ydraws.length; i++) {
                ctx.drawImage(this.arrowSprite, spriteXStart, ARROW_SPRITE_YSTART, ARROW_SIDE_LENGTH, ARROW_SIDE_LENGTH, this.boundingBox.getLeft(), (_c = ydraws[i]) !== null && _c !== void 0 ? _c : this.boundingBox.getTop(), drawSideLength, drawSideLength);
            }
        }
        ctx.font = "20px Jersey-20";
        ctx.fillStyle = "#b5b5b5";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        // Draw text
        if (this.direction === DoorDirection.UP) {
            ctx.textAlign = "center";
            ctx.fillText(this.targetSceneId, (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2, this.boundingBox.getBottom() + 16);
            ctx.strokeText(this.targetSceneId, (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2, this.boundingBox.getBottom() + 16);
        }
        else if (this.direction === DoorDirection.DOWN) {
            ctx.textAlign = "center";
            ctx.fillText(this.targetSceneId, (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2, this.boundingBox.getTop());
            ctx.strokeText(this.targetSceneId, (this.boundingBox.getLeft() + this.boundingBox.getRight()) / 2, this.boundingBox.getTop());
        }
        else if (this.direction === DoorDirection.LEFT) {
            ctx.textAlign = "left";
            ctx.fillText(this.targetSceneId, this.boundingBox.getRight(), (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2);
            ctx.strokeText(this.targetSceneId, this.boundingBox.getRight(), (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2);
        }
        else {
            ctx.textAlign = "right";
            ctx.fillText(this.targetSceneId, this.boundingBox.getLeft(), (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2);
            ctx.strokeText(this.targetSceneId, this.boundingBox.getLeft(), (this.boundingBox.getTop() + this.boundingBox.getBottom()) / 2);
        }
        if (context.debug) {
            // Draw door trigger zone in green with transparency
            ctx.strokeStyle = "#00FF00";
            ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
            ctx.lineWidth = 2;
            ctx.fillRect(this.boundingBox.getLeft(), this.boundingBox.getTop(), this.boundingBox.getRight() - this.boundingBox.getLeft(), this.boundingBox.getBottom() - this.boundingBox.getTop());
            ctx.strokeRect(this.boundingBox.getLeft(), this.boundingBox.getTop(), this.boundingBox.getRight() - this.boundingBox.getLeft(), this.boundingBox.getBottom() - this.boundingBox.getTop());
            // Draw label showing target scene
            ctx.fillStyle = "#00FF00";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`→ ${this.targetSceneId}`, this.boundingBox.getLeft() + (this.boundingBox.getRight() - this.boundingBox.getLeft()) / 2, this.boundingBox.getTop() + (this.boundingBox.getBottom() - this.boundingBox.getTop()) / 2);
        }
        ctx.restore();
    }
}
