import { Injectable } from '@angular/core';
import { Pick } from './pick-interface';
import { Game } from './game-interface';

@Injectable({
  providedIn: 'root'
})
export class PickService {
  // picks field
  picks: Pick[] = [];

  createPick(game: Game) {
    const pick: Pick = {
      MLPick: game.ml_pick ?? "",
      MLPickOdds: game.ml_pick_odds ?? 0,
      OUPick: game.ou_pick ?? "",
      OULine: game.pregame_ou_line ?? 0,
      game_date: new Date(),
      winningTeam: game.winningTeam ?? "",
      losingTeam: game.losingTeam ?? "",
      total: game.total
    }

  this.picks.push(pick);
  console.log(this.picks);

  }

  getPicks(): Pick[] {
    console.log(this.picks)
    return this.picks
  }

}
