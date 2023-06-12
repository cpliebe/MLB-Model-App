import { Component } from '@angular/core';
import { Game } from '../game-interface';
import { GAMES } from '../mock-games';
import { TEAMS} from '../teams-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedGame?: Game;
  onSelect(game: Game): void {
    this.selectedGame = game;
  }

games = GAMES;
teams = TEAMS;
}
