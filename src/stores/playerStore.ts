import { create, createStore, useStore } from 'zustand'
import { IPlayer } from '../types/Player'

export interface PlayerStore {
  players: IPlayer[]
}

export interface PlayerStoreActions {
  addPlayer: (player: IPlayer) => void
  addScore: (playerIdx: number, score: number) => void
}

export const usePlayerStore = create<PlayerStore & PlayerStoreActions>(set => ({
  players: [
    {
      id: 1,
      score: 0,
      username: 'dompagoj',
      snakeColor: 'rgb(209, 19, 70)',
    },
    {
      id: 2,
      score: 0,
      username: 'Teanovic',
      snakeColor: 'rgb(41, 110, 207)',
    },
  ],
  addPlayer: player => set(state => ({ players: [...state.players, player] })),
  addScore: (idx, score) =>
    set(state => {
      const player = state.players[idx]
      player.score += score

      return { players: [...state.players] }
    }),
}))
