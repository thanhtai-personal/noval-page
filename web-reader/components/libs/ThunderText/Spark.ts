export class Spark {
  x: number;
  y: number;
  v: any;
  a: any;
  g: any;
  width: number;
  lifespan: number;
  maxlife: number;
  color: string;
  prev: { x: number; y: number };

  constructor(options: any = {}, w: number, h: number) {
    this.x = options.x || w * 0.5;
    this.y = options.y || h * 0.5;
    this.v = options.v || {
      direct: Math.random() * Math.PI * 2,
      weight: Math.random() * 14 + 2,
      friction: 0.88,
    };
    this.a = options.a || {
      change: Math.random() * 0.4 - 0.2,
      min: this.v.direct - Math.PI * 0.4,
      max: this.v.direct + Math.PI * 0.4,
    };
    this.g = options.g || {
      direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2),
      weight: Math.random() * 0.25 + 0.25,
    };
    this.width = options.width || Math.random() * 3;
    this.lifespan = options.lifespan || Math.round(Math.random() * 20 + 40);
    this.maxlife = this.lifespan;
    this.color = options.color || "#feca32";
    this.prev = { x: this.x, y: this.y };
  }

  update(index: number, array: Spark[]) {
    this.prev = { x: this.x, y: this.y };
    this.x += Math.cos(this.v.direct) * this.v.weight;
    this.x += Math.cos(this.g.direct) * this.g.weight;
    this.y += Math.sin(this.v.direct) * this.v.weight;
    this.y += Math.sin(this.g.direct) * this.g.weight;
    if (this.v.weight > 0.2) this.v.weight *= this.v.friction;
    this.v.direct += this.a.change;
    if (this.v.direct > this.a.max || this.v.direct < this.a.min)
      this.a.change *= -1;
    this.lifespan--;
    if (this.lifespan <= 0) this.remove(index, array);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.prev.x, this.prev.y);
    ctx.stroke();
    ctx.closePath();
  }

  remove(index: number, array: Spark[]) {
    array.splice(index, 1);
  }
}
