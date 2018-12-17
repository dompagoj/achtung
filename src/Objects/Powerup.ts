export class Powerup extends Phaser.GameObjects.Sprite {
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
}
