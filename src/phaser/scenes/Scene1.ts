import { GameObjects, Geom, Input, Math as PMath, Scene } from 'phaser'
import { usePlayerStore } from '../../stores/playerStore'
import { Coords } from '../Objects/Coords'
import { Snake } from '../Objects/Snake'
import { getRandomColor } from '../utils'

export class Scene1 extends Scene {
  public snakes: Snake[] = []
  public losers: Snake[] = []
  public winner: Snake | null = null
  public pixels: boolean[][] = []
  public roundEnded: boolean = false

  public constructor() {
    super({ key: 'Scene1' })
  }

  public create_snakes() {
    const players = usePlayerStore.getState().players
    const color1 = Phaser.Display.Color.RGBStringToColor(players[0].snakeColor)
    this.snakes.push(
      new Snake(
        this,
        players[0],
        color1.color,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        200,
        200
      )
    )

    const color2 = Phaser.Display.Color.RGBStringToColor(players[1].snakeColor)
    this.snakes.push(
      new Snake(
        this,
        players[1],
        color2.color,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.D,
        200,
        400
      )
    )
    usePlayerStore.setState({ players })

    this.snakes.forEach(snake => {
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
    this.losers.push(snake)
    snake.kill()

    this.end_game()
  }

  public calculate_scores() {
    if (!this.roundEnded) {
      const winnerIndex = usePlayerStore.getState().players.findIndex(player => player.id === this.winner?.player.id)
      if (winnerIndex !== -1) {
        usePlayerStore.getState().addScore(winnerIndex, 3)
      }
    }
  }

  public new_round() {
    this.snakes.forEach(snake => {
      snake.graphicsCircle.clear()
      snake.graphicsLine.clear()
      snake.destroy()
    })
    this.snakes = []
    this.losers = []
    this.create_snakes()
    this.roundEnded = false
  }

  public end_game() {
    if (this.roundEnded) return

    const isAliveCount = this.snakes.reduce((acc, snake) => {
      if (snake.isAlive) acc++

      return acc
    }, 0)

    if (isAliveCount <= 1) {
      this.winner = this.snakes.find(snake => snake.isAlive)!
      this.calculate_scores()
      this.roundEnded = true
      setTimeout(() => {
        this.new_round()
      }, 3000)
    }
  }

  public collision_check(snake: Snake) {
    for (const otherSnake of this.snakes) {
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

  public override update(time: number) {
    if (this.roundEnded) return
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].move()
      this.snakes[i].update_graphics()
      this.collision_check(this.snakes[i])
    }
  }
}
