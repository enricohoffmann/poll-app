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


  toggleAnswer(answerIndex: number): void {

    if(!this.allowMultipleAnswer){
      this.deselectAllAnswers();
    }

    const selectControl = this.questionFormGroup().controls.answers.at(answerIndex).controls.select;
    selectControl.setValue(!selectControl.value);
  }

  get allowMultipleAnswer(): boolean {
    return this.questionFormGroup().controls.allow_multiple_answers.value;
  }

  private deselectAllAnswers(): void {
    for(let answerIndex = 0; answerIndex < this.questionFormGroup().controls.answers.value.length; answerIndex++){
      this.questionFormGroup().controls.answers.at(answerIndex).controls.select.setValue(false);
    }
  }

}
