import { Component, OnInit } from '@angular/core';
import { ScoresService } from '../../services/scores.service';
import { CommonModule } from '@angular/common';
import { Score, TeamScore } from '../../models/score.model';

@Component({
  standalone: true,
  selector: 'app-scoreboard',
  imports: [CommonModule],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent implements OnInit {
  sortedScores: any = [];
  teams: TeamScore[] = [];
  scores: Score = {
    Equipe1: 0,
    Equipe2: 0,
    Equipe3: 0,
    Equipe4: 0,
    Equipe5: 0
  }

  constructor(private scoresService: ScoresService) {}

  ngOnInit(): void {
    this.scoresService.getScores().subscribe((data: any[]) => {
      data.forEach(epreuve => {
        this.scores.Equipe1 += Number(epreuve["Equipe 1"]);
        this.scores.Equipe2 += Number(epreuve["Equipe 2"]);
        this.scores.Equipe3 += Number(epreuve["Equipe 3"]);
        this.scores.Equipe4 += Number(epreuve["Equipe 4"]);
        this.scores.Equipe5 += Number(epreuve["Equipe 5"]);
      })
      console.log('Scores:', data);
      this.sortedScores = Object.entries(this.scores).sort(([, a], [, b]) => b - a);
      this.teams.push({name: "Captain", color: "red", points: this.scores.Equipe1})
      this.teams.push({name: "Limoncello", color: "yellow", points: this.scores.Equipe2})
      this.teams.push({name: "Subway", color: "green", points: this.scores.Equipe3})
      this.teams.push({name: "Dubosc", color: "purple", points: this.scores.Equipe4})
      this.teams.push({name: "Bercot", color: "white", points: this.scores.Equipe5})
      this.teams.sort((a, b) => b.points - a.points);

      console.log(this.sortedScores);
      console.log(this.teams);
    });
  }

  getTeamColor(color: string): string {
    switch (color) {
      case 'red': return '#a72d2d';
      case 'green': return '#2e7d32';
      case 'yellow': return '#f9b233';
      case 'purple': return '#673ab7';
      case 'white': return '#e0e0e0';
      default: return '#888';
    }
  }

  darkenColor(hex: string): string {
    const val = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((val >> 16) & 0xff) - 40);
    const g = Math.max(0, ((val >> 8) & 0xff) - 40);
    const b = Math.max(0, (val & 0xff) - 40);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
}
