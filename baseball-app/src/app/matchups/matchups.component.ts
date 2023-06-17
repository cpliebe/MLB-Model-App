import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../game-interface';
import { ScheduleService } from '../schedule.service';
import { TEAMS } from '../teams-list';
import { FormControl } from '@angular/forms';
import { interval, Subscription, Observable } from 'rxjs';
import {MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { OddsService } from '../odds.service';
import { Odds } from '../odds.service';
import { MatIconModule } from '@angular/material/icon';
import { PickService } from '../pick.service';

@Component({
  selector: 'app-matchups',
  templateUrl: './matchups.component.html',
  styleUrls: ['./matchups.component.css']
})
export class MatchupsComponent implements OnInit, OnDestroy {
  schedule: Game[] = [];
  selectedDate = new FormControl();
  overUnderInput: number = 0;
  private updateSubscription: Subscription = new Subscription();
  currentDate: Date = new Date();
  oddsList: Odds[] = [];
  over_under: string = '';
  total: number = 0;
  ml_pick: string = '';
  ml_odds: number = 0;


  constructor(private scheduleService: ScheduleService, private http: HttpClient, 
    private oddsService: OddsService, private pickService: PickService) {
  }

  ngOnInit(): void {
    this.getTodaySchedule();
    this.updateSubscription = interval(60000).subscribe(() => {
      this.getTodaySchedule();
    })
    this.callGetOdds().subscribe(
      (odds: Odds[]) =>{
      this.oddsList = odds;
    },
    error => {

    }
    )
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
  getYesterdaySchedule(): void {
    const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  this.currentDate = yesterday;

    this.scheduleService.getYesterdaySchedule().subscribe(
      (schedule) => {
        this.schedule = this.mapToGames(schedule, this.oddsList);
        console.log(this.schedule);
      },
      (error) => {
        console.log('Error getting schedule:', error);
      }
    );
  }
  getTomorrowSchedule(): void {
    const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  this.currentDate = tomorrow;
    this.scheduleService.getTomorrowSchedule().subscribe(
      (schedule) => {
        this.schedule = this.mapToGames(schedule, this.oddsList);
        console.log(this.schedule);
      },
      (error) => {
        console.log('Error getting schedule:', error);
      }
    );
  }


  getTodaySchedule(): void {
    this.currentDate = new Date();
    this.scheduleService.getTodaySchedule().subscribe(
      (schedule) => {
        this.schedule = this.mapToGames(schedule, this.oddsList);
        console.log(this.schedule);
      },
      (error) => {
        console.log('Error getting schedule:', error);
      }
    );
  }

  getTeamAbbreviation(teamName: string): string {
    const team = TEAMS.find(team => team.name === teamName);
    return team?.abbreviation || teamName;
  }

  mapToGames(schedule: any[], oddsList: Odds[]): Game[] {
    const uniqueGames: Game[] = [];
  
    schedule.forEach((item) => {
      const existingGame = uniqueGames.find((game) =>
        game.home_team === item.home_name &&
        game.away_team === item.away_name &&
        game.time === item.game_datetime,
    
      );
  
      if (existingGame) {
        // Update existing game properties if necessary
        existingGame.home_score = item.home_score;
        existingGame.away_score = item.away_score;
        existingGame.current_inning = item.current_inning;
        existingGame.inning_state = item.inning_state;
        existingGame.status = item.status;
        existingGame.winning_pitcher = item.winning_pitcher;
        existingGame.losing_pitcher = item.losing_pitcher;
      } else {
        console.log()
        // Create a new game
        const game: Game = {
          home_team: item.home_name,
          away_team: item.away_name,
          time: item.game_datetime,
          home_starting_pitcher: item.home_probable_pitcher,
          away_starting_pitcher: item.away_probable_pitcher,
          home_score: item.home_score,
          away_score: item.away_score,
          current_inning: item.current_inning,
          inning_state: item.inning_state,
          status: item.status,
          winning_pitcher: item.winning_pitcher,
          losing_pitcher: item.losing_pitcher,
          total: item.total,
          over_under: 0,
          isEditable: true,
          away_team_odds: 0,
          home_team_odds: 0,
        };
  
        uniqueGames.push(game);
      }
    });
  
    // Update game objects with odds data
    oddsList.forEach((oddsItem) => {
      const game = uniqueGames.find((game) =>
        game.home_team === oddsItem.home_team &&
        game.away_team === oddsItem.away_team &&
        game.time === oddsItem.start_time
      );
  
      if (game) {
        game.away_team_odds = oddsItem.away_odds;
        game.home_team_odds = oddsItem.home_odds;
        game.over_under = oddsItem.over_under_line;
      }
    });
  
    return uniqueGames;
  }
  

  getTeamLogo(teamName: string): string {
    const team = TEAMS.find(team => team.name === teamName);
    return team ? team.logo : '';
  }

  callGetOdds(): Observable<Odds[]> {
    return this.oddsService.getDraftKingsOdds();
  }

  getCurrentTime(): Date {
    return new Date();
  }
  convertToDateTime(gameTime: string): Date {
    return new Date(gameTime);
  }

  createPick(game: Game) {
    this.pickService.createPick(game)
  }
  selectOverUnder(overUnder: string, total: number, game: Game) {
    game.ou_pick = overUnder;
    game.pregame_ou_line = total; 
  }

  selectMoneyLine(moneyLinePick: string, odds: number, game: Game) {
    game.ml_pick = moneyLinePick;
    game.ml_pick_odds = odds;
  }
}

