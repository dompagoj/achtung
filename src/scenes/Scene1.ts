import {GameObjects, Geom, Input, Math as PMath, Scene} from 'phaser'
import { Snake } from '../Objects/Snake'

export class Scene1 extends Scene {

  public snakes: Snake[] = []
  // public snake: Snake

  public constructor() {
    super({key: 'Scene1'})
  }

  public create_snakes() {
    for (let i = 0; i < 1; i++) {
    this.snakes.push(new Snake(this))

    this.snakes.forEach((snake) => {
    this.add.existing(snake)
    })
    }
  }
  public preload() {
    this.load.image('snakeHead', 'assets/sprites/snakeHead.png')
  }

  public create() {
    this.create_snakes()

  }

  public update() {
    this.snakes.forEach((snake) => {
    snake.move()
    snake.update_graphics()
    })
  }
}
