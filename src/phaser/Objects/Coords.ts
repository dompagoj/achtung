export class Coords {

  public x: number
  public y: number

  // public active: boolean

  public constructor(x: number, y: number) {
    this.x = Math.floor(x)
    this.y = Math.floor(y)

    // this.active = false
  }
}
