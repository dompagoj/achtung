import React, { Component } from 'react'
import { observer } from 'mobx-react'
import './App.css'
import { playerStore } from './stores/playerStore'

@observer
class App extends Component {
  render() {
    if (!playerStore.players) {
      return null
    }
    return (
      <div className="container">
        <div className="scoreboard">
          {playerStore.players.map(player => (
            <div key={player.id}>
              <div style={{ display: 'flex' }}>
                <span style={{ backgroundColor: player.snakeColor, width: 100, height: 35 }} />
                <span>{player.username}</span>
              </div>
              <span>{player.score}</span>
            </div>
          ))}
        </div>
        <div id="game-area" />
      </div>
    )
  }
}

export default App
