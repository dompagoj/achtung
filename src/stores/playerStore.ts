import { observable, action } from 'mobx'
import { IPlayer } from '../types/Player'

class PlayerStore {
  @observable
  public players: IPlayer[] = []

  @action.bound
  public addPlayer(data: IPlayer) {
    this.players.push(data)
  }
}

export const playerStore = new PlayerStore()
