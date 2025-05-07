import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// import { Observable, of } from 'rxjs';
// import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {

  constructor(private readonly httpClient: HttpClient) { }

  getScores(): any {
    console.log("Bienvenue en", environment);
    return this.httpClient.get(`${environment.apiUrl}`);
  //   return of([
  //     {
  //         "Epreuves": "Relais Eau",
  //         "Equipe 1": "5",
  //         "Equipe 2": "2",
  //         "Equipe 3": "4",
  //         "Equipe 4": "3",
  //         "Equipe 5": "1"
  //     },
  //     {
  //         "Epreuves": "Parcous Combattant",
  //         "Equipe 1": "5",
  //         "Equipe 2": "1",
  //         "Equipe 3": "3",
  //         "Equipe 4": "4",
  //         "Equipe 5": "2"
  //     },
  //     {
  //         "Epreuves": "A l'aveugle",
  //         "Equipe 1": "5",
  //         "Equipe 2": "2",
  //         "Equipe 3": "3",
  //         "Equipe 4": "4",
  //         "Equipe 5": "1"
  //     },
  //     {
  //         "Epreuves": "Dégustation",
  //         "Equipe 1": "3",
  //         "Equipe 2": "5",
  //         "Equipe 3": "2",
  //         "Equipe 4": "4",
  //         "Equipe 5": "1"
  //     },
  //     {
  //         "Epreuves": "Poule renard vipère",
  //         "Equipe 1": "5",
  //         "Equipe 2": "3",
  //         "Equipe 3": "2",
  //         "Equipe 4": "4",
  //         "Equipe 5": "1"
  //     }
  // ])
  }
}
