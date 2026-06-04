import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SurveyService } from './services/survey-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('poll-app');

  s = new SurveyService();

}
