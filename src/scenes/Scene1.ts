import { Scene } from 'phaser'
import { Snake } from '../Objects/Snake'

export class Scene1 extends Scene {
  // public snakes: Snake[] = []
  public snake: Snake

  public constructor() {
    super({ key: 'Scene1' })
  }

  public preload() {
    // this.load.image('snakeHead', 'assets/sprites/snakeHead.png')
  }

  public create() {
    this.snake = new Snake(this)
    this.add.existing(this.snake)
  }

  public update() {
    if (this.snake.isAlive) {
      this.snake.move()
      this.snake.update_graphics()
    }
  }
}
