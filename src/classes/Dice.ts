export class Dice {
  readonly faces: number[];

  public getFaces(): number[] {
    return [...this.faces];
  }

  constructor(faces: number[]) {
    if (faces.length === 0) {
      throw new Error("Dice must have at least one face.");
    }
    this.faces = faces;
  }

  roll(index: number): number {
    if (index < 0 || index >= this.faces.length) {
      throw new Error(`Invalid roll index: ${index}`);
    }
    return this.faces[index];
  }

  toString(): string {
    return `[${this.faces.join(",")}]`;
  }
}
