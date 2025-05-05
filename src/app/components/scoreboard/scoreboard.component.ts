import { Component, OnInit } from '@angular/core';
import { ScoresService } from '../../services/scores.service';

@Component({
  standalone: true,
  selector: 'app-scoreboard',
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent implements OnInit {

  constructor(private scoresService: ScoresService) {}

  ngOnInit(): void {
    this.scoresService.getScores().subscribe(data => {
      console.log('Scores:', data);
    });  }
  
}
