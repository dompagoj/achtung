import { Display, GameObjects, Geom, Input, Scene } from 'phaser'
import { Scene1 } from '../scenes/Scene1'
import { Coords } from './Coords'

function cantor_pair(a: number, b: number) {
  return ((a + b) * (a + b + 1)) / 2 + b
}

export class Snake extends Phaser.GameObjects.Sprite {
  public speedModifier: number = 1.5
  public angleIncrement = this.speedModifier / 20
  public lineCompensation = this.speedModifier * 1.5
  public lineWidth: number = 10

  public keyLeft: Input.Keyboard.Key
  public keyRight: Input.Keyboard.Key

  public lines: Geom.Line[] = []

  public xBeforeAngleChange: number
  public yBeforeAngleChange: number

  public graphics: GameObjects.Graphics

  public lastLocation: Coords
  public currentLocation: Coords

  public boundingCircle: Geom.Circle

  constructor(scene: Scene1, keyLeft: Phaser.Input.Keyboard.KeyCodes, keyRight: Phaser.Input.Keyboard.KeyCodes) {
    super(scene, Math.random() % 400, Math.random() % 400, 'snakeHead')
    this.setScale(0.1)
    // this.setPosition(Math.random() % 400, Math.random() % 400)

    this.scene = scene

    const color = Display.Color.RandomRGB().color

    this.graphics = scene.add.graphics({ lineStyle: { width: this.lineWidth, color } })

    this.init_keys(keyLeft, keyRight)
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

  public init_keys(keyLeft: Phaser.Input.Keyboard.KeyCodes, keyRight: Phaser.Input.Keyboard.KeyCodes) {
    this.keyLeft = this.scene.input.keyboard.addKey(keyLeft)
    this.keyRight = this.scene.input.keyboard.addKey(keyRight)
  }

  public create_line(x1: number, y1: number, x2: number, y2: number) {
    return new Phaser.Geom.Line(x1, y1, x2, y2)
  }

  public create_line_default() {
    const xCompensation = Math.cos(this.angle) * (this.lineCompensation - this.getBounds().width / 2.5)
    const yCompensation = Math.sin(this.angle) * (this.lineCompensation - this.getBounds().height / 2.5)

    return this.create_line(this.xBeforeAngleChange - xCompensation, this.yBeforeAngleChange - yCompensation, this.x + xCompensation, this.y + yCompensation)
  }

  public collision_check(lines: Geom.Line[]) {

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

  public moved_a_pixel() {
    return this.lastLocation !== this.currentLocation
  }

  public kill() {
    this.destroy()
  }

  public increase_parameters() {
    this.speedModifier += 0.0015
    this.angleIncrement = this.speedModifier / 20
    this.lineCompensation = this.speedModifier * 1.5
    this.lineWidth += 1.1
  }

  public move() {
    // this.increase_parameters()

    this.lastLocation = this.currentLocation

    this.change_angle()

    const offsetX = Math.cos(this.angle) * this.speedModifier
    const offsetY = Math.sin(this.angle) * this.speedModifier

    this.setPosition(this.x + offsetX, this.y + offsetY)

    this.out_of_bounds_check()

    this.currentLocation = new Coords(this.x, this.y)

    return this.currentLocation
  }
}
