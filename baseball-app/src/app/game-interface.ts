import { Pick } from "./pick-interface";

export interface Game {
    home_team: string;
    away_team: string;
    time: string;
    home_starting_pitcher: string;
    away_starting_pitcher: string;
    home_logo?: string; // New property for the home team logo
    away_logo?: string; // New property for the away team logo
    home_score?: number;
    away_score?: number;
    current_inning?: number;
    inning_state?: string;
    status?: string;
    winning_pitcher?: string;
    losing_pitcher?: string;
    total?: number;
    over_under?: number;
    isEditable?: boolean;
    home_team_odds?: number;
    away_team_odds?: number;
    ou_pick?: string;
    ml_pick?: string;
    ml_pick_odds?: number;
    pregame_ou_line?: number;
    winningTeam?: string;
    losingTeam?: string

    


  }
  
