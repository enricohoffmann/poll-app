import { Component, input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { QuestionForm } from '../../utils/types';
import { AnswerView } from '../answer-view/answer-view';

@Component({
  selector: 'app-question-view',
  imports: [AnswerView],
  templateUrl: './question-view.html',
  styleUrl: './question-view.scss',
})
export class QuestionView {
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionIndex = input.required<number>();

}
