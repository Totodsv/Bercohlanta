import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {

  constructor(private readonly httpClient: HttpClient) { }

  getScores() {
    return this.httpClient.get(environment.apiUrl);
  }
}
