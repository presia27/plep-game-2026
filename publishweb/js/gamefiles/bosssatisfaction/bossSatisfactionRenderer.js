const PANELWIDTH = 300;
const PANELHEIGHT = 45;
export class SatisfactionRenderer {
    /**
     *
     * @param posX X position to draw on the canvas
     * @param posY Y position to draw on the canvas
     * @param bossManager Instance of BossSatisfaction holding the satisfaction state from which to draw from
     */
    constructor(posX, posY, bossManager) {
        this.posX = posX;
        this.posY = posY;
        this.bossManager = bossManager;
    }
    draw(context) {
        const ctx = context.ctx;
        ctx.save();
        // Draw background panel
        // Create linear gradient
        const grad = ctx.createLinearGradient(this.posX, 0, this.posX + PANELWIDTH, 0);
        grad.addColorStop(0, "#730906");
        grad.addColorStop(1, "#023e2b");
        // Fill rectangle with gradient
        ctx.fillStyle = grad;
        ctx.fillRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);
        // Draw border
        ctx.strokeStyle = 'rgb(233, 151, 151)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.posX, this.posY, PANELWIDTH, PANELHEIGHT);
        // Draw title
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Boss Satisfaction', this.posX, this.posY - 10);
        // Get satisfaction state
        const satisfaction = this.bossManager.getSatisfaction();
        // Draw satisfaction number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(Math.ceil(satisfaction).toString(), this.posX + PANELWIDTH - 30, this.posY + PANELHEIGHT - 20);
        // Draw background panel
        if (satisfaction <= 0) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 1280, 720);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px Arial';
            ctx.fillText('YOU LOST - BOSS SATISFACTION DROPPED TO 0!', 150, ctx.canvas.height / 2);
        }
        ctx.restore();
    }
}
