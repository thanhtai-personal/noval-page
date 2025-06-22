import { Spark } from "./Spark";

export class Particles {
  sparks: Spark[];

  constructor(options: any = {}, w: number, h: number) {
    const max = options.max || Math.round(Math.random() * 10 + 10);
    this.sparks = [...new Array(max)].map(() => new Spark(options, w, h));
  }

  update() {
    this.sparks.forEach((s, i) => s.update(i, this.sparks));
  }

  render(ctx: CanvasRenderingContext2D) {
    this.sparks.forEach((s) => s.render(ctx));
  }
}
