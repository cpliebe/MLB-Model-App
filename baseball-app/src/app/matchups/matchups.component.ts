import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../game-interface';
import { ScheduleService } from '../schedule.service';
import { TEAMS } from '../teams-list';
import { FormControl } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
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

  constructor(private scheduleService: ScheduleService) {
  }

  ngOnInit(): void {
    this.getSchedule();
    this.updateSubscription = interval(30000).subscribe(() => {
      this.getSchedule();
    })
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
  

  getSchedule(): void {
    this.scheduleService.getTodaySchedule().subscribe(
      (schedule) => {
        this.schedule = this.mapToGames(schedule);
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

  mapToGames(schedule: any[]): Game[] {
    return schedule.map((item) => ({
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
      over_under: undefined,
      isEditable: true
    }));
  }

  updateOverUnder(game: Game, overUnder: number): void {
    game.over_under = overUnder;
  }

  getTeamLogo(teamName: string): string {
    const team = TEAMS.find(team => team.name === teamName);
    return team ? team.logo : '';
  }
  
}

