import { Display, GameObjects, Geom, Input, Scene } from 'phaser'

export class Snake extends Phaser.GameObjects.Sprite {
  public readonly speedModifier: number = 100.5
  public readonly angleIncrement = this.speedModifier / 20
  public readonly lineCompensation = this.speedModifier * 1.5
  public lineWidth: number = 10

  public keyLeft: Input.Keyboard.Key
  public keyRight: Input.Keyboard.Key

  public lines: Geom.Line[] = []

  public xBeforeAngleChange: number
  public yBeforeAngleChange: number

  public graphics: GameObjects.Graphics

  constructor(scene: Scene) {
    super(scene, 20, 20, 'snakeHead')
    this.setScale(0.3)
    this.setPosition(50, 50)

    this.scene = scene

    const color = Display.Color.RandomRGB().color

    this.graphics = scene.add.graphics({ lineStyle: { width: this.lineWidth, color } })

    this.init_keys()
    this.init_line_creation()

    this.angle = Math.random() % 360
  }

  public update_graphics() {
    this.graphics.clear()
    this.lines.forEach((line) => this.graphics.strokeLineShape(line)) // sketchy
  }

  public init_line_creation() {
    this.angle_changed()
  }

  public init_keys() {
    this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  }

  public create_line(x1: number, y1: number, x2: number, y2: number) {
    return new Phaser.Geom.Line(x1, y1, x2, y2)
  }

  public create_line_default() {
    const xCompensation = Math.cos(this.angle) * this.lineCompensation
    const yCompensation = Math.sin(this.angle) * this.lineCompensation

    return this.create_line(this.xBeforeAngleChange, this.yBeforeAngleChange, this.x + xCompensation, this.y + yCompensation)
  }

  public extend_line() {
    this.lines[this.lines.length - 1] = this.create_line_default()
  }

  public add_line() {
    this.lines.push(this.create_line_default())
  }

  public angle_changed() {
    this.xBeforeAngleChange = this.x
    this.yBeforeAngleChange = this.y

    this.add_line()
  }

  public change_angle() {
    let angleChanged = false

    if (this.keyLeft.isDown) {
      this.setAngle(this.angle - this.angleIncrement)
      angleChanged = true
    }

    if (this.keyRight.isDown) {
      this.setAngle(this.angle + this.angleIncrement)
      angleChanged = true
    }

    if (angleChanged) {
      this.angle_changed()
    } else {
      this.extend_line()
    }
  }

  public out_of_bounds_check() {
    const {height, width} = this.scene.game.canvas

    if (this.y > height) {
      this.y = 0
      return this.angle_changed()
    }
    if (this.y < 0) {
      this.y = height
      return this.angle_changed()
    }
    if (this.x > width) {
      this.x = 0
      return this.angle_changed()
    }
    if (this.x < 0) {
      this.x = width
      return this.angle_changed()
    }
  }

  public move() {
    this.change_angle()

    const offsetX = Math.cos(this.angle) * this.speedModifier
    const offsetY = Math.sin(this.angle) * this.speedModifier

    this.setPosition(this.x + offsetX, this.y + offsetY)

    this.out_of_bounds_check()
  }
}
