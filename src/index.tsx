import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { playerStore } from './stores/playerStore'

playerStore.addPlayer({
  id: 1,
  score: 0,
  username: 'dompagoj',
  snakeColor: 'blue',
})
playerStore.addPlayer({
  id: 2,
  score: 0,
  username: 'teanovic',
  snakeColor: 'red',
})
require('./phaser/main')

ReactDOM.render(<App />, document.getElementById('root')) as App

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
