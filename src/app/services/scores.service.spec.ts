import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ScoresService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load team metadata from a dedicated teams sheet', () => {
    service.getScores().subscribe((data) => {
      expect(data.teams).toEqual([
        { key: 'Equipe 1', name: 'Captain', color: 'red' },
        { key: 'Equipe 2', name: 'Limoncello', color: 'blue' }
      ]);
    });

    const scoresReq = httpMock.expectOne(environment.apiUrl);
    expect(scoresReq.request.method).toBe('GET');
    scoresReq.flush([
      { Epreuves: 'Relais Eau', 'Equipe 1': 2, 'Equipe 2': 3 }
    ]);

    const teamsUrl = (environment as any).teamsApiUrl || `${environment.apiUrl}?sheet=Equipes`;
    const teamsReq = httpMock.expectOne(teamsUrl);
    expect(teamsReq.request.method).toBe('GET');
    teamsReq.flush([
      { 'ID Equipe': 'Equipe 1', 'Nom Equipe': 'Captain', couleur: 'red' },
      { 'ID Equipe': 'Equipe 2', 'Nom Equipe': 'Limoncello', couleur: 'blue' }
    ]);
  });
});
