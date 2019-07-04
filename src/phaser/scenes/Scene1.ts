import { GameObjects, Geom, Input, Math as PMath, Scene } from 'phaser'
import _ from 'lodash';
import { Snake } from '../Objects/Snake'
import { playerStore } from '../../stores/playerStore'
import { getRandomColor } from '../utils'
import { sendMessage, setMessageHandler, } from '../../network';

let scene1Singleton: Scene1;
console.log('process.env.REACT_APP_PLAYER_INDEX!', process.env.REACT_APP_PLAYER_INDEX!)

export class Scene1 extends Scene {
  public snakes: Snake[] = []
  public losers: Snake[] = []
  public winner: Snake
  public pixels: boolean[][] = []
  public roundEnded: boolean = false

  public constructor() {
    super({ key: 'Scene1' });
    scene1Singleton = this;
  }

  public create_snakes() {
    const color1 = getRandomColor()
    this.snakes.push(
      new Snake(
        this,
        playerStore.players[0],
        color1.color,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        200,
        200,
      ),
    )
    console.log(color1.rgba)
    playerStore.players[0].snakeColor = color1.rgba

    const color2 = getRandomColor()
    this.snakes.push(
      new Snake(
        this,
        playerStore.players[1],
        color2.color,
        Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.D,
        200,
        400,
      ),
    )
    playerStore.players[1].snakeColor = color2.rgba

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
      const winnerIndex = playerStore.players.findIndex(player => player.id === this.winner.player.id)
      if (winnerIndex !== -1) {
        playerStore.players[winnerIndex].score += 3
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

  public update(time: number) {
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].move()
      this.snakes[i].update_graphics()
      this.collision_check(this.snakes[i])
    }



    const stringifiedSnakes = JSON.stringify({
      playerIndex: parseInt(process.env.REACT_APP_PLAYER_INDEX!),
      snakes: this.snakes,
      winner: this.winner,
      losers: this.losers,
    });

    sendMessage(stringifiedSnakes);
  }
}

setMessageHandler((stringifiedScene1) => {
  const { playerIndex, ...sceneState } = JSON.parse(stringifiedScene1);
  sceneState.snakes.forEach((snakeSnake, index) => {
    if (playerIndex !== index) {
      _.merge(scene1Singleton.snakes[index], snakeSnake);
    }
  });
});
