import { GameObjects, Geom, Input, Math as PMath, Scene } from 'phaser'
import * as Collections from 'typescript-collections'
import { Coords } from '../Objects/Coords'
import { Snake } from '../Objects/Snake'

export class Scene1 extends Scene {

  public snakes: Snake[] = []
  public visitedPixels: Collections.BSTree<number> = new Collections.BSTree<number>()

  public constructor() {
    super({ key: 'Scene1' })
  }

  public create_snakes() {
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT))
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.D))

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

  public add_coordinates(newSquare: number) {
    this.visitedPixels.add(newSquare)
  }

  public collision_check(snake: Snake, newSquare: number) {
    if (this.visitedPixels.contains(newSquare) === false) {
      this.add_coordinates(newSquare)
      console.log(newSquare)
    } else {
      snake.kill()
    }
  }

  public update() {
    this.snakes.forEach((snake) => {
      const newSquare = snake.move()
      snake.update_graphics()

      this.collision_check(snake, newSquare)
    })
  }
}
