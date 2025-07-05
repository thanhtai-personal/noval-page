export class Thunder {
  lifespan: number;
  maxlife: number;
  color: string;
  glow: string;
  x: number;
  y: number;
  width: number;
  direct: number;
  max: number;
  segments: any[];

  constructor(options: any = {}, w: number = 100, h: number = 100) {
    this.lifespan = options["lifespan"] || Math.round(Math.random() * 10 + 10);
    this.maxlife = this.lifespan;
    this.color = options["color"] || "#fefefe";
    this.glow = options["glow"] || "#2323fe";
    this.x = options["x"] || Math.random() * w;
    this.y = options["y"] || Math.random() * h;
    this.width = options["width"] || 2;
    this.direct = options["direct"] || Math.random() * Math.PI * 2;
    this.max = options["max"] || Math.round(Math.random() * 10 + 20);
    this.segments = [...new Array(this.max)].map(() => {
      return {
        direct: this.direct + (Math.PI * Math.random() * 0.2 - 0.1),
        length: Math.random() * 20 + 80,
        change: Math.random() * 0.04 - 0.02,
      };
    });
  }

  update(index: number, array: any[]) {
    this.segments.forEach((s) => {
      s.direct += s.change;
      if (Math.random() > 0.96) s.change *= -1;
    });
    this.lifespan > 0 ? this.lifespan-- : this.remove(index, array);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 32;
    ctx.shadowColor = this.glow;
    ctx.moveTo(this.x, this.y);
    let prev = { x: this.x, y: this.y };

    this.segments.forEach((s) => {
      const x = prev.x + Math.cos(s.direct) * s.length;
      const y = prev.y + Math.sin(s.direct) * s.length;

      prev = { x, y };
      ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.closePath();
    ctx.shadowBlur = 0;
    const strength = Math.random() * 80 + 40;
    const light = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      strength,
    );

    light.addColorStop(0, "rgba(250, 200, 50, 0.6)");
    light.addColorStop(0.1, "rgba(250, 200, 50, 0.2)");
    light.addColorStop(0.4, "rgba(250, 200, 50, 0.06)");
    light.addColorStop(0.65, "rgba(250, 200, 50, 0.01)");
    light.addColorStop(0.8, "rgba(250, 200, 50, 0)");
    ctx.beginPath();
    ctx.fillStyle = light;
    ctx.arc(this.x, this.y, strength, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  remove(index: number, array: any[]) {
    array.splice(index, 1);
  }
}
