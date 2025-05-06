import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {

  constructor(private readonly httpClient: HttpClient) { }

  getScores(): any {
    return this.httpClient.get(environment.apiUrl);
  }
}
