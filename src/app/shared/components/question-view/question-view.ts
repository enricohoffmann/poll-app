import { Component, input } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { QuestionForm } from '../../utils/types';

@Component({
  selector: 'app-question-view',
  imports: [],
  templateUrl: './question-view.html',
  styleUrl: './question-view.scss',
})
export class QuestionView {
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionIndex = input.required<number>();

}
