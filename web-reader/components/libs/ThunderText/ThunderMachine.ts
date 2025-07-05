import { Particles } from "./Particles";
import { TextEffect } from "./TextEffect";
import { Thunder } from "./Thunder";

export class ThunderMachine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: HTMLInputElement;
  private w: number;
  private h: number;
  private thunder: any[] = [];
  private particles: any[] = [];
  private text: any;

  constructor(
    canvasId = "canvas",
    inputId = "input",
    w = window.innerWidth,
    h = window.innerHeight,
  ) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.input = document.getElementById(inputId) as HTMLInputElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.w = w;
    this.h = h;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  public execute(text: string = "") {
    this.text = new TextEffect(
      { copy: text },
      this.w,
      this.h,
      this.thunder,
      this.particles,
    );

    this.canvas.addEventListener("click", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      this.thunder.push(new Thunder({ x, y }, this.w, this.h));
      this.particles.push(new Particles({ x, y }, this.w, this.h));
    });

    let cb: ReturnType<typeof setTimeout>;

    if (this.input) {
      this.input.addEventListener("keyup", (e) => {
        clearTimeout(cb);
        cb = setTimeout(() => {
          this.text = new TextEffect(
            { copy: this.input.value },
            this.w,
            this.h,
            this.thunder,
            this.particles,
          );
        }, 300);
      });
    }
    this.loop();
  }

  public setText(text: string) {
    if (!this.text) return;
    this.text.setText(text);
  }

  public setSpeed(speed: number) {
    if (!this.text) return;
    this.text.setSpeed(speed);
  }

  private loop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update() {
    this.text.update();
    this.thunder.forEach((t, i) => t.update(i, this.thunder));
    this.particles.forEach((p) => p.update());
  }

  private render() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.globalCompositeOperation = "screen";
    this.text.render(this.ctx);
    this.thunder.forEach((t) => t.render(this.ctx));
    this.particles.forEach((p) => p.render(this.ctx));
  }
}
