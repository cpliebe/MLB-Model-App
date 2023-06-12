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


  }
  
