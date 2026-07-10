import { Component, OnInit } from '@angular/core';
import { ScoresService } from '../../services/scores.service';
import { CommonModule } from '@angular/common';
import { Score, TeamDefinition, TeamScore } from '../../models/score.model';

@Component({
  standalone: true,
  selector: 'app-scoreboard',
  imports: [CommonModule],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent implements OnInit {
  sortedScores: [string, number][] = [];
  teams: TeamScore[] = [];
  scores: Score = {};

  constructor(private scoresService: ScoresService) {}

  ngOnInit(): void {
    this.scoresService.getScores().subscribe((data: any) => {
      const rows = Array.isArray(data?.scores) ? data.scores : [];
      const teamDefinitions: TeamDefinition[] = Array.isArray(data?.teams) ? data.teams : [];

      this.buildScores(rows);
      this.buildTeams(teamDefinitions);
    });
  }

  private buildScores(rows: any[]): void {
    const teamKeys = this.extractTeamKeys(rows);
    this.scores = {} as Score;

    teamKeys.forEach((teamKey) => {
      this.scores[teamKey] = 0;
    });

    rows.forEach((epreuve) => {
      teamKeys.forEach((teamKey) => {
        this.scores[teamKey] += Number(epreuve[teamKey] ?? 0);
      });
    });

    this.sortedScores = Object.entries(this.scores).sort(([, a], [, b]) => Number(b) - Number(a)) as [string, number][];
  }

  private extractTeamKeys(rows: any[]): string[] {
    const keys = new Set<string>();

    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (this.isTeamKey(key)) {
          keys.add(key);
        }
      });
    });

    return Array.from(keys);
  }

  private isTeamKey(key: string): boolean {
    const normalized = key.trim().toLowerCase();
    if (!normalized) {
      return false;
    }

    const metadata = ['epreuves', 'épreuves', 'epreuve', 'preuve', 'preuves'];
    return !metadata.includes(normalized);
  }

  private buildTeams(teamDefinitions: TeamDefinition[]): void {
    this.teams = this.sortedScores.map(([teamKey, points]) => {
      const definition = teamDefinitions.find((team) => team.key === teamKey);
      const fallbackName = teamKey;

      return {
        key: teamKey,
        name: definition?.name || fallbackName,
        color: definition?.color || 'default',
        points
      };
    });

    this.teams.sort((a, b) => b.points - a.points);
  }

  getTeamColor(color: string): string {
    switch (color.toLowerCase()) {
      case 'red':
      case 'darkred': return '#a72d2d';
      case 'green':
      case 'darkgreen': return '#2e7d32';
      case 'lightgreen': return '#7cb342';
      case 'yellow': return '#f9b233';
      case 'purple': return '#673ab7';
      case 'blue':
      case 'lightblue': return '#1976d2';
      case 'darkblue': return '#0d47a1';
      case 'orange':
      case 'darkorange': return '#ff9800';
      case 'pink': return '#d81b60';
      case 'silver': return '#b0b0b0';
      case 'grey':
      case 'gray': return '#9e9e9e';
      case 'brown': return '#8d4a1f';
      case 'gold':
      case 'golden': return '#c9a227';
      case 'black': return '#111111';
      case 'white': return '#f5f5f5';
      case 'cyan': return '#00acc1';
      case 'magenta': return '#c2185b';
      case 'teal': return '#00897b';
      case 'lime': return '#7cb342';
      case 'maroon': return '#880e4f';
      case 'olive': return '#808000';
      case 'navy': return '#0d47a1';
      case 'aqua': return '#26c6da';
      case 'default':
        return '#888';
      default: return color.startsWith('#') ? color : '#888';
    }
  }

  darkenColor(hex: string): string {
    if (!hex.startsWith('#')) {
      return hex;
    }

    const val = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((val >> 16) & 0xff) - 40);
    const g = Math.max(0, ((val >> 8) & 0xff) - 40);
    const b = Math.max(0, (val & 0xff) - 40);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
