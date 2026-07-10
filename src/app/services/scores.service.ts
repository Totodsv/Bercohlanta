import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ScoreboardData, TeamDefinition } from '../models/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  constructor(private readonly httpClient: HttpClient) { }

  getScores(): Observable<ScoreboardData> {
    console.log('Bienvenue en', environment);

    if (environment.useMockData) {
      const fakeData: ScoreboardData = {
        scores: [
          {
            Epreuves: 'Relais Eau',
            'Equipe 1': '2',
            'Equipe 2': '5',
            'Equipe 3': '4',
            'Equipe 4': '3',
            'Equipe 5': '1',
            'Equipe 6': '6'
          },
          {
            Epreuves: 'Parcours Combattant',
            'Equipe 1': '1',
            'Equipe 2': '5',
            'Equipe 3': '3',
            'Equipe 4': '4',
            'Equipe 5': '2',
            'Equipe 6': '5'
          },
          {
            Epreuves: 'À l’aveugle',
            'Equipe 1': '2',
            'Equipe 2': '5',
            'Equipe 3': '3',
            'Equipe 4': '4',
            'Equipe 5': '1',
            'Equipe 6': '4'
          }
        ],
        teams: [
          { key: 'Equipe 1', name: 'Captain', color: 'red' },
          { key: 'Equipe 2', name: 'Limoncello', color: 'yellow' },
          { key: 'Equipe 3', name: 'Subway', color: 'green' },
          { key: 'Equipe 4', name: 'Dubosc', color: 'purple' },
          { key: 'Equipe 5', name: 'Bercot', color: 'white' },
          { key: 'Equipe 6', name: 'Riviera', color: 'blue' }
        ]
      };

      return of(fakeData);
    }

    return this.getScoresFromSheet();
  }

  getScoresFromSheet(): Observable<ScoreboardData> {
    const primaryUrl = environment.apiUrl;
    const fallbackUrl = (environment as any).fallbackApiUrl;

    return this.httpClient.get<any>(primaryUrl).pipe(
      map((payload) => this.mapPayloadToScoreboardData(payload)),
      catchError((error) => {
        if (fallbackUrl && fallbackUrl !== primaryUrl) {
          return this.httpClient.get<any>(fallbackUrl).pipe(
            map((payload) => this.mapPayloadToScoreboardData(payload))
          );
        }

        return throwError(() => error);
      })
    );
  }

  private mapPayloadToScoreboardData(payload: any): ScoreboardData {
    const rows = this.extractRows(payload);
    const teamKeys = this.extractTeamKeysFromRows(rows);
    const teamDefinitions = this.buildTeamDefinitionsFromRows(rows, teamKeys);

    return {
      scores: rows.filter((row) => !this.isColorRow(row) && !this.isMetaColorRow(row)).map((row) => this.normalizeScoreRow(row)),
      teams: teamDefinitions
    };
  }

  private extractRows(payload: any): any[] {
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      if (Array.isArray(payload.rows)) {
        return payload.rows;
      }
      if (Array.isArray(payload.scores)) {
        return payload.scores;
      }
    }

    return Array.isArray(payload) ? payload : [];
  }

  private extractTeamKeysFromRows(rows: any[]): string[] {
    const teamKeys = new Set<string>();

    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (this.isTeamColumn(key) && !this.isColorRow(row) && !this.isMetaColorRow(row)) {
          teamKeys.add(key.trim());
        }
      });
    });

    return Array.from(teamKeys);
  }

  private buildTeamDefinitionsFromRows(rows: any[], teamKeys: string[]): TeamDefinition[] {
    const colorRow = rows.find((row) => this.isMetaColorRow(row));
    if (!colorRow) {
      return teamKeys.map((key) => ({ key, name: key, color: 'default' }));
    }

    return teamKeys.map((key) => ({
      key,
      name: key,
      color: this.normalizeColor(String(colorRow[key] ?? 'default'))
    }));
  }

  private isColorRow(row: any): boolean {
    const normalizedValues = Object.values(row || {}).map((value) => String(value ?? '').trim().toLowerCase());
    return normalizedValues.includes('color') || normalizedValues.includes('couleur');
  }

  private isMetaColorRow(row: any): boolean {
    const firstValue = String(row?.Epreuves ?? row?.epreuves ?? row?.[Object.keys(row || {})[0]] ?? '').trim().toLowerCase();
    return firstValue === 'meta_color' || firstValue === 'meta color';
  }

  private normalizeColor(value: string): string {
    const normalized = value.trim().toLowerCase();
    return normalized || 'default';
  }

  private mapSheetRowsToScoreboardData(rows: any[]): ScoreboardData {
    const normalizedRows = Array.isArray(rows) ? rows : [];
    const scores = normalizedRows.map((row) => this.normalizeScoreRow(row));

    return {
      scores,
      teams: []
    };
  }

  private normalizeScoreRow(row: any): Record<string, string | number> {
    const normalizedRow: Record<string, string | number> = {};

    Object.entries(row || {}).forEach(([key, value]) => {
      if (this.isTeamColumn(key)) {
        normalizedRow[key] = Number(value ?? 0);
      } else if (!this.isMetadataColumn(key)) {
        normalizedRow[key] = String(value ?? '');
      }
    });

    return normalizedRow;
  }

  private isTeamColumn(key: string): boolean {
    const normalized = key.trim().toLowerCase();
    if (!normalized) {
      return false;
    }

    const metadata = ['epreuves', 'épreuves', 'epreuve', 'preuve', 'preuves'];
    if (metadata.includes(normalized)) {
      return false;
    }

    return true;
  }

  private isMetadataColumn(key: string): boolean {
    const normalized = key.trim().toLowerCase();
    return ['epreuves', 'épreuves', 'epreuve', 'preuve', 'preuves'].includes(normalized);
  }
}
