import { GameObjects, Geom, Input, Math as PMath, Scene } from 'phaser'
import * as Collections from 'typescript-collections'
import { Coords } from '../Objects/Coords'
import { Snake } from '../Objects/Snake'

export class Scene1 extends Scene {

  public snakes: Snake[] = []
  public pixels: boolean[][] = []

  public constructor() {
    super({ key: 'Scene1' })
  }

  public create_snakes() {
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT, 200, 200))
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.D, 200, 400))
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.K, Phaser.Input.Keyboard.KeyCodes.L, 200, 600))

    // for (let i = 0; i < 2; i++) {
    //   if (i === 1) {
    //   } else {
    //   }

    this.snakes.forEach((snake) => {
      this.add.existing(snake)
    })
  }

  public preload() {
    this.load.image('snakeHead', 'assets/sprites/snakeHead.png')
  }

  public create() {
    this.create_snakes()
  }

  public kill_snake(snake: Snake) {
    // this.snakes = this.snakes.filter(s => s.id !== snake.id)
    snake.kill()

    this.end_game()
  }

  public end_game() {
    const isAliveCount = this.snakes.reduce((acc, snake) => {
      if (snake.isAlive)
        acc++

      return acc
     }, 0)

    if (isAliveCount === 1)
      setTimeout(() => {location.reload()}, 3000)
  }

  public collision_check(snake: Snake) {
      for (const otherSnake of this.snakes) {
        if (snake !== otherSnake && Geom.Intersects.CircleToCircle(snake.collisionCircle, otherSnake.collisionCircle)) {
          this.kill_snake(snake)
          this.kill_snake(otherSnake)
        }

        for (let i = 0; i < otherSnake.lines.length; i++) {
          if (Geom.Intersects.LineToCircle(otherSnake.lines[i], snake.collisionCircle)) {
            otherSnake.graphicsLine.lineStyle(2, 0xff00000)
            otherSnake.graphicsLine.strokeLineShape(otherSnake.lines[i])

            snake.graphicsCircle.lineStyle(1, 0xff00000)
            snake.graphicsCircle.strokeCircleShape(snake.collisionCircle)
            this.kill_snake(snake)

          }
        }
      }
  }

  public update(time: number) {
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].move()
      this.snakes[i].update_graphics()
      this.collision_check(this.snakes[i])
    }
  }
}
