import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionForm } from '../../utils/types';
import { AnswerView } from '../answer-view/answer-view';

/**
 * @description Component for viewing a question in the poll.
 */
@Component({
  selector: 'app-question-view',
  imports: [AnswerView],
  templateUrl: './question-view.html',
  styleUrls: ['./question-view.scss'],
})
export class QuestionView {
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionIndex = input.required<number>();
  isReadOnly = input.required<boolean>();

  /**
   * @description Toggles the selection of an answer for the question.
   * @param answerIndex 
   * @returns void
   * @remarks If multiple answers are not allowed, it will deselect all other answers before toggling the selected answer.
   */
  toggleAnswer(answerIndex: number): void {

    if(!this.allowMultipleAnswer && !this.isReadOnly){
      this.deselectAllAnswers();
    }

    const selectControl = this.questionFormGroup().controls.answers.at(answerIndex).controls.select;
    selectControl.setValue(!selectControl.value);
  }

  /**
   * @description Determines if multiple answers are allowed for the question.
   * @returns boolean
   * @remarks This is based on the 'allow_multiple_answers' control in the question form group.
   */
  get allowMultipleAnswer(): boolean {
    return this.questionFormGroup().controls.allow_multiple_answers.value;
  }

  /**
   * @description Deselects all answers for the question.
   * @returns void
   * @remarks This method is called when toggling an answer if multiple answers are not allowed.
   */
  private deselectAllAnswers(): void {
    for(let answerIndex = 0; answerIndex < this.questionFormGroup().controls.answers.value.length; answerIndex++){
      this.questionFormGroup().controls.answers.at(answerIndex).controls.select.setValue(false);
    }
  }

}
