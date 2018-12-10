import { Display, GameObjects, Geom, Input, Scene } from 'phaser'

export class Snake extends Phaser.GameObjects.Sprite {
  public speedModifier = 3.5
  public angleIncrement = this.speedModifier / 40
  public lineCompensation = this.speedModifier * 1.5
  public head: Geom.Circle
  public isAlive = true

  public graphics: GameObjects.Graphics
  private lineWidth = 10

  private keyLeft: Input.Keyboard.Key
  private keyRight: Input.Keyboard.Key

  private lines: Geom.Line[] = []

  private xBeforeAngleChange: number
  private yBeforeAngleChange: number

  constructor(scene: Scene) {
    super(scene, 20, 20, 'snakeHead')
    this.setScale(0.3)
    this.setPosition(50, 50)

    this.scene = scene

    this.graphics = scene.add.graphics({ lineStyle: { width: this.lineWidth, color: this.getRandomColor() } })

    this.init_keys()
    this.init_line_creation()
  }

  public move() {
    this.change_angle()

    const offsetX = Math.cos(this.angle) * this.speedModifier
    const offsetY = Math.sin(this.angle) * this.speedModifier

    this.head.setPosition(this.x + 5, this.y + 5)
    this.setPosition(this.x + offsetX, this.y + offsetY)

    this.collisionCheck()
    this.out_of_bounds_check()
  }

  public update_graphics() {
    this.graphics.clear()
    this.graphics.strokeCircleShape(this.head)
    this.lines.forEach(line => this.graphics.strokeLineShape(line)) // sketchy
  }

  private getRandomColor() {
    return Display.Color.RandomRGB().color
  }

  private init_line_creation() {
    this.head = new Geom.Circle(this.x + 5, this.y + 5, 5)
    this.angle_changed()
  }

  private collisionCheck() {
    this.lines.forEach((line, index) => {
      if (Geom.Intersects.LineToCircle(line, this.head)) {
        console.log('DEAD!')
      }
    })
  }

  private init_keys() {
    this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  }

  private create_line(x1: number, y1: number, x2: number, y2: number) {
    return new Phaser.Geom.Line(x1, y1, x2, y2)
  }

  private create_line_default() {
    const xCompensation = Math.cos(this.angle) * this.lineCompensation
    const yCompensation = Math.sin(this.angle) * this.lineCompensation

    return this.create_line(
      this.xBeforeAngleChange,
      this.yBeforeAngleChange,
      this.x + xCompensation,
      this.y + yCompensation,
    )
  }

  private extend_line() {
    this.lines[this.lines.length - 1] = this.create_line_default()
  }

  private add_line() {
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
