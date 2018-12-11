export class Coords {

  public x: number
  public y: number

  // public active: boolean

  public constructor(x: number, y: number) {
    this.x = Math.round(x)
    this.y = Math.round(y)

    // this.active = false
  }
}
