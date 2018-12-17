import * as Phaser from 'phaser'
import { Scene1 } from './scenes/Scene1'

const config: GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  parent: 'game-area',
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Scene1],
}
new Phaser.Game(config)
