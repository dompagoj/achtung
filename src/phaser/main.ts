import { Scene1 } from './scenes/Scene1'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  parent: 'game-area',
  height: 1000,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Scene1],
}
new Phaser.Game(config)
