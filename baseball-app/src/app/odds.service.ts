import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OddsObject {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    last_update: string;
    markets: {
      key: string;
      last_update: string;
      outcomes: {
        name: string;
        price: number;
        point?: number;
      }[];
    }[];
  }[];
}

export interface Odds {
  away_team: string;
  home_team: string;
  home_odds?: number;
  away_odds?: number;
  over_odds?: number;
  under_odds?: number;
  over_under_line?: number;
  start_time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OddsService {
  private apiUrl = 'https://api.the-odds-api.com/v4/sports/baseball_mlb/odds';
  private apiKey = 'cdb5dd9f5006d6bb8b1782da42170fbc';

  constructor(private http: HttpClient) { }

  getOdds(): Observable<OddsObject[]> {
    const params = {
      apiKey: this.apiKey,
      regions: 'us',
      markets: 'h2h',
      dateFormat: 'iso',
      oddsFormat: 'american'
    };

    return this.http.get<OddsObject[]>(this.apiUrl, { params });
  }

  getOverUnder(): Observable<OddsObject[]> {
    const params = {
      apiKey: this.apiKey,
      regions: 'us',
      markets: 'totals',
      dateFormat: 'iso',
      oddsFormat: 'american'
    };

    return this.http.get<OddsObject[]>(this.apiUrl, { params });
  }

  getDraftKingsOdds(): Observable<Odds[]> {
    return new Observable<Odds[]>(observer => {
      const draftKingsOddsData: Odds[] = [];
  
      // Fetch h2h data
      this.getOdds().subscribe(
        (h2hData: OddsObject[]) => {
          const modifiedH2HData: Odds[] = h2hData.map(obj => {
            const bookmaker = obj.bookmakers[0];
            const homeOutcome = bookmaker?.markets[0]?.outcomes.find(outcome => outcome.name === obj.home_team);
            const awayOutcome = bookmaker?.markets[0]?.outcomes.find(outcome => outcome.name === obj.away_team);
            const homeOdds = homeOutcome?.price;
            const awayOdds = awayOutcome?.price;
  
            return {
              away_team: obj.away_team,
              home_team: obj.home_team,
              away_odds: awayOdds,
              home_odds: homeOdds,
              start_time: obj.commence_time,
            };
          });
  
          draftKingsOddsData.push(...modifiedH2HData);
  
          // Fetch totals data
          this.getOverUnder().subscribe(
            (totalsData: OddsObject[]) => {
              const modifiedTotalsData: Odds[] = totalsData.map(obj => {
                const bookmaker = obj.bookmakers[0];
                const overOutcome = bookmaker?.markets[0]?.outcomes.find(outcome => outcome.name === 'Over');
                const underOutcome = bookmaker?.markets[0]?.outcomes.find(outcome => outcome.name === 'Under');
                const overOdds = overOutcome?.price;
                const underOdds = underOutcome?.price;
                const overUnderLine = overOutcome?.point;
  
                return {
                  away_team: obj.away_team,
                  home_team: obj.home_team,
                  over_odds: overOdds,
                  under_odds: underOdds,
                  over_under_line: overUnderLine,
                  start_time: obj.commence_time,
                };
              });
  
              // Merge h2h and totals data and ensure uniqueness
              const mergedData: Odds[] = [];
  
              modifiedTotalsData.forEach(totals => {
                const existingGame = draftKingsOddsData.find(game =>
                  game.away_team === totals.away_team && game.home_team === totals.home_team && game.start_time === totals.start_time
                );
  
                if (existingGame) {
                  // Update the existing game with totals data
                  existingGame.over_odds = totals.over_odds;
                  existingGame.under_odds = totals.under_odds;
                  existingGame.over_under_line = totals.over_under_line;
                } else {
                  // Add a new game with totals data
                  mergedData.push(totals);
                }
              });
  
              // Merge h2h and unique totals data
              const uniqueData = draftKingsOddsData.concat(mergedData);
  
              observer.next(uniqueData);
              observer.complete();
            },
            error => {
              observer.error(error);
            }
          );
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
  
  }