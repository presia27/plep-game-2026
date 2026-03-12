// flickerLightRenderer.ts
import { IRenderer, GameContext } from "../../../classinterfaces.ts";
import { FlickerLightConfig } from "../roomData.ts";

/**
 * Renders a soft, flickering fluorescent light pool.
 * Uses a radial gradient + perlin-style noise via summed sines
 * to mimic the uneven flicker of fluorescent tubes.
 * @author Claude
 */
export class FlickerLightRenderer implements IRenderer {
  private config: FlickerLightConfig;
  private time: number = 0;

  // Summed sine parameters — multiple frequencies give organic flicker
  // rather than a single clean pulse
  private readonly FREQ_A = 7.3;
  private readonly FREQ_B = 13.7;
  private readonly FREQ_C = 3.1;
  private readonly AMP_A = 0.4;
  private readonly AMP_B = 0.35;
  private readonly AMP_C = 0.25;

  constructor(config: FlickerLightConfig) {
    this.config = config;
  }

  public draw(context: GameContext): void {
    this.time += context.clockTick * this.config.flickerSpeed;

    // Sum of sines produces irregular, organic flicker
    const raw =
      Math.sin(this.time * this.FREQ_A) * this.AMP_A +
      Math.sin(this.time * this.FREQ_B) * this.AMP_B +
      Math.sin(this.time * this.FREQ_C) * this.AMP_C;

    // Normalize from [-1, 1] range to [0, 1]
    const normalized = (raw + 1) / 2;

    const alpha = this.config.minAlpha + normalized * (this.config.maxAlpha - this.config.minAlpha);

    const ctx = context.ctx;
    const { position, width, height, color } = this.config;

    const cx = position.x + width / 2;
    const cy = position.y + height / 2;

    ctx.save();

    // Radial gradient: bright center fading to transparent edges
    // Use ellipse scaling trick via ctx.scale to get an oval light pool
    ctx.translate(cx, cy);
    ctx.scale(1, height / width); // squash vertically for floor-perspective oval

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width / 2);
    gradient.addColorStop(0, this.hexToRgba(color, alpha));
    gradient.addColorStop(0.5, this.hexToRgba(color, alpha * 0.5));
    gradient.addColorStop(1, this.hexToRgba(color, 0));

    ctx.globalCompositeOperation = "lighter"; // additive blend — stacks nicely with floor
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }
}