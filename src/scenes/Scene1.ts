<<<<<<< HEAD
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
=======
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

  public create_pixel_array() {
    const { height, width } = this.game.canvas

    for (let i = 0; i < width; i++) {
      this.pixels.push([])
      for (let j = 0; j < height; j++) {
        this.pixels[i].push(false)
      }
    }
  }

  public create_snakes() {
    this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT))
    // this.snakes.push(new Snake(this, Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.D))

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
    this.create_pixel_array()
  }

  public create() {
    this.create_snakes()
  }

  public add_coordinates(newSquare: Coords) {
    this.pixels[newSquare.x][newSquare.y] = true
  }

  public print_pixels() {
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < this.pixels[i].length; j++) {
        console.log(this.pixels[i][j])
      }
    }
  }

  // public collision_check(i: number, newSquare: Coords) {
  //   if (this.pixels[newSquare.x][newSquare.y] === false) {
  //     this.add_coordinates(newSquare)
  //   } else {
  //     const snake = this.snakes[i]
  //     this.snakes = this.snakes.splice(i, 1)
  //     snake.kill()
  //   }
  // }

  public collision_check(i: number, newSquare: Coords) {
    for (const snake of this.snakes) {
      for (const otherSnake of this.snakes) {
        for (let i = 0; i < otherSnake.lines.length - 10; i++) {
          if (Phaser.Geom.Intersects.LineToRectangle(otherSnake.lines[i], snake.getBounds())) {
            snake.kill()
          }
        }
      }
    }

  }

  public update() {
    for (let i = 0; i < this.snakes.length; i++) {
      const newSquare = this.snakes[i].move()
      this.snakes[i].update_graphics()
      this.collision_check(i, newSquare)
>>>>>>> feature/collision2
    }
  }
}
