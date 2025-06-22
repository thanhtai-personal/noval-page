import { Thunder } from "./Thunder";
import { Particles } from "./Particles";

type OptionsProps = {
  size: number;
  copy: string;
  color: string;
  delay: number;
  basedelay: number;
  bound: any;
  x: number;
  y: number;
  data: any;
  index: number;
};

export class TextEffect {
  options: OptionsProps;
  w: number;
  h: number;
  thunder: any[];
  particles: any[];
  speedMultiplier: number;

  constructor(
    options: Partial<OptionsProps> & { speedMultiplier?: number },
    w: number,
    h: number,
    thunder: any[],
    particles: any[],
  ) {
    this.w = w;
    this.h = h;
    this.thunder = thunder;
    this.particles = particles;
    this.speedMultiplier = options.speedMultiplier || 1;

    this.options = {
      size: options.size ?? 100,
      copy: (options.copy ?? "Hello!") + " ",
      color: options.color ?? "#cd96fe",
      delay: 0,
      basedelay: 0,
      bound: null,
      x: options.x ?? 0,
      y: options.y ?? 0,
      data: null,
      index: 0,
    };

    this.setup(options);
  }

  setup(options: Partial<OptionsProps>) {
    const pool = document.createElement("canvas");
    const buffer = pool.getContext("2d")!;
    pool.width = this.w;
    buffer.fillStyle = "#000000";
    buffer.fillRect(0, 0, pool.width, pool.height);

    this.options.size = options.size ?? 100;
    this.options.copy = (options.copy ?? "Hello!") + " ";
    this.options.color = options.color ?? "#cd96fe";
    this.options.basedelay = (options.delay ?? 5) / this.speedMultiplier;
    this.options.delay = this.options.basedelay;

    buffer.font = `${this.options.size}px Comic Sans MS`;
    this.options.bound = buffer.measureText(this.options.copy);
    this.options.bound.height = this.options.size * 1.5;
    this.options.x = options.x ?? this.w * 0.5 - this.options.bound.width * 0.5;
    this.options.y = options.y ?? this.h * 0.5 - this.options.size * 0.5;

    buffer.strokeStyle = this.options.color;
    buffer.strokeText(this.options.copy, 0, this.options.bound.height * 0.8);
    this.options.data = buffer.getImageData(
      0,
      0,
      this.options.bound.width,
      this.options.bound.height,
    );
    this.options.index = 0;
  }

  setText(newText: string) {
    this.setup({
      copy: newText,
      delay: this.options.basedelay * this.speedMultiplier,
    });
  }

  setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
    this.options.basedelay = 5 / multiplier;
    this.options.delay = this.options.basedelay;
  }

  update() {
    if (this.options.index >= this.options.bound.width) {
      this.options.index = 0;
      return;
    }

    const data = this.options.data.data;
    for (
      let i = this.options.index * 4;
      i < data.length;
      i += 4 * this.options.data.width
    ) {
      const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3];
      if (bitmap > 255 && Math.random() > 0.96) {
        const x = this.options.x + this.options.index;
        const y = this.options.y + i / this.options.bound.width / 4;
        this.thunder.push(new Thunder({ x, y }));
        if (Math.random() > 0.5)
          this.particles.push(new Particles({ x, y }, this.w, this.h));
      }
    }

    if (this.options.delay-- < 0) {
      this.options.index++;
      this.options.delay += this.options.basedelay;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(
      this.options.data,
      this.options.x,
      this.options.y,
      0,
      0,
      this.options.index,
      this.options.bound.height,
    );
  }
}
