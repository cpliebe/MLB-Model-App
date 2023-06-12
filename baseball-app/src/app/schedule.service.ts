import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getTodaySchedule(): Observable<any> {
    const url = `${this.apiUrl}/today_schedule`;
    return this.http.get<any>(url);
  }
}

