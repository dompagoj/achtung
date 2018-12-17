import { Display, GameObjects, Geom, Input, Scene } from 'phaser'
import {v4} from 'uuid'
import { Scene1 } from '../scenes/Scene1'
import { Coords } from './Coords'

export class Snake extends Phaser.GameObjects.Sprite {
  public id: string = v4()
  public speedModifier: number = 3
  public angleIncrement = this.speedModifier / 40
  public lineCompensation = this.speedModifier * 3
  public lineWidth: number = 10

  public graphicsLine: GameObjects.Graphics
  public graphicsCircle: GameObjects.Graphics

  public collisionCircle: Geom.Circle
  public collisionCircleOffset = 1.2 * this.lineCompensation + 2
  public collisionCircleRadius = 5

  public lines: Geom.Line[] = []

  public isAlive = true

  public lineGap = false
  public lineGapChance = 0.002
  public lineGapModifier = 30
  public minLineGapTimeOutTime = this.lineGapModifier / this.speedModifier * this.collisionCircleRadius
  public maxLineGapTimeOutTime = this.lineGapModifier / this.speedModifier * this.collisionCircleRadius * 4

  private keyLeft: Input.Keyboard.Key
  private keyRight: Input.Keyboard.Key

  private xBeforeAngleChange: number
  private yBeforeAngleChange: number

  constructor(scene: Scene1, keyLeft: Phaser.Input.Keyboard.KeyCodes, keyRight: Phaser.Input.Keyboard.KeyCodes, x: number, y: number) {
    super(scene, x, y, 'snakeHead')

    this.setScale(0.1)

    this.init_collision_circle()

    this.scene = scene

    this.graphicsLine = scene.add.graphics({ lineStyle: { width: this.lineWidth, color: this.getRandomColor() } })
    this.graphicsCircle = scene.add.graphics({ lineStyle: { width: 1, color: 0x0000ff } })

    this.init_keys(keyLeft, keyRight)
    this.init_line_creation()
  }

  public init_collision_circle() {
    this.collisionCircle = new Geom.Circle(this.x, this.y, this.collisionCircleRadius)
    this.update_collision_circle_position()
  }

  public update_graphics() {
    this.graphicsLine.clear()
    this.graphicsCircle.clear()
    this.graphicsCircle.strokeCircleShape(this.collisionCircle)
    this.lines.forEach(line => this.graphicsLine.strokeLineShape(line))
  }

  public init_keys(keyLeft: Phaser.Input.Keyboard.KeyCodes, keyRight: Phaser.Input.Keyboard.KeyCodes) {
    this.keyLeft = this.scene.input.keyboard.addKey(keyLeft)
    this.keyRight = this.scene.input.keyboard.addKey(keyRight)
  }

  public create_line_default() {
    const xCompensation = Math.cos(this.angle) * this.lineCompensation
    const yCompensation = Math.sin(this.angle) * this.lineCompensation

    return this.create_line(this.xBeforeAngleChange, this.yBeforeAngleChange, this.x + xCompensation, this.y + yCompensation)
  }

  public kill() {
    this.isAlive = false
  }

  public increase_parameters() {
    this.speedModifier += 0.0015
    this.angleIncrement = this.speedModifier / 20
    this.lineCompensation = this.speedModifier * 1.5
    this.lineWidth += 1.1
  }

  public update_collision_circle_position() {
    this.collisionCircle.setPosition(this.x + Math.cos(this.angle) * this.collisionCircleOffset, this.y + Math.sin(this.angle) * this.collisionCircleOffset)
  }

  public move() {
    if (this.isAlive === false)
      return

    this.line_gap()

    this.increase_parameters()

    this.change_angle()

    const offsetX = Math.cos(this.angle) * this.speedModifier
    const offsetY = Math.sin(this.angle) * this.speedModifier

    this.setPosition(this.x + offsetX, this.y + offsetY)

    this.update_collision_circle_position()
    this.out_of_bounds_check()
  }

  private getRandomColor() {
    return Display.Color.RandomRGB().color
  }

  private init_line_creation() {
    this.angle_changed()
  }

  private create_line(x1: number, y1: number, x2: number, y2: number) {
    return new Phaser.Geom.Line(x1, y1, x2, y2)
  }

  private toggle_line_gap() {
    this.angle_changed()
    this.lineGap = !this.lineGap
  }

  private roll_for_line_gap() {
    return Math.random() < this.lineGapChance
  }

  private line_gap() {
    if (this.lineGap === false && this.roll_for_line_gap()) {
      this.toggle_line_gap()
      setTimeout(() => {this.toggle_line_gap()}, Math.random() * (this.maxLineGapTimeOutTime - this.minLineGapTimeOutTime) + this.minLineGapTimeOutTime)
    }
  }

  private extend_line() {
    if (this.lineGap)
      return

    this.lines[this.lines.length - 1] = this.create_line_default()
  }

  private add_line() {
    if (this.lineGap)
      return

    this.lines.push(this.create_line_default())
  }

  private angle_changed() {
    this.xBeforeAngleChange = this.x
    this.yBeforeAngleChange = this.y

    this.add_line()
  }

  private change_angle() {
    let angleChanged = false

    if (this.keyLeft.isDown) {
      this.angle -= this.angleIncrement
      angleChanged = true
    }

    if (this.keyRight.isDown) {
      this.angle += this.angleIncrement
      angleChanged = true
    }

    angleChanged ? this.angle_changed() : this.extend_line()
  }

  private out_of_bounds_check() {
    const { height, width } = this.scene.game.canvas

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
}
