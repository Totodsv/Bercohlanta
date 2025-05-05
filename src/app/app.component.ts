import { Component } from '@angular/core';
import { ScoreboardComponent } from "./components/scoreboard/scoreboard.component";

@Component({
  selector: 'app-root',
  imports: [ScoreboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'evg-olympiades';
}
