import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { QuestionForm } from '../../utils/types';

@Component({
  selector: 'app-question-vote',
  imports: [],
  templateUrl: './question-vote.html',
  styleUrl: './question-vote.scss',
})
export class QuestionVote {
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionIndex = input.required<number>();
}
