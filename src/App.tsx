import './App.css'
import { usePlayerStore } from './stores/playerStore'

export const App = () => {
  const players = usePlayerStore(s => s.players)

  return (
    <div className="container">
      <div className="scoreboard">
        {players.map(player => (
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

export default App
