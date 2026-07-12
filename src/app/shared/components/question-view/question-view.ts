import { Component, input } from '@angular/core';
import { QuestionWithAnswers } from '../../../interfaces/question-with-answers-interface';

@Component({
  selector: 'app-question-view',
  imports: [],
  templateUrl: './question-view.html',
  styleUrl: './question-view.scss',
})
export class QuestionView {
  question = input.required<QuestionWithAnswers>();
  questionIndex = input.required<number>();
}
