import { Component, input, signal, output, inject, OnInit } from '@angular/core';
import { Button } from "../button/button";
import { InputField } from "../input-field/input-field";
import { FormGroup } from '@angular/forms';
import { AnswerCreate } from '../answer-create/answer-create';
import { CheckField } from '../check-field/check-field';
import { ValidationService } from '../../../services/validation-service';
import { AnswerForm, QuestionForm } from '../../utils/types';

/**
 * @description Component for creating a question with its answers in a poll application.
 * @implements OnInit
 * @property {FormGroup<QuestionForm>} questionFormGroup - The form group for the question and its answers.
 * @property {number} questionIndex - The index of the question in the poll.
 */
@Component({
  selector: 'app-question-create',
  imports: [Button, InputField, AnswerCreate, CheckField],
  templateUrl: './question-create.html',
  styleUrls: ['./question-create.scss'],
})
export class QuestionCreate implements OnInit {
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionIndex = input<number>(0);
  answerCount = signal<number>(0);
  readonly addAnswerEvent = output<number>();
  readonly removeAnswerEvent = output<{ questionIndex: number; answerIndex: number }>(); 
  readonly removeQuestionEvent = output<number>();
  validationService = inject(ValidationService);
  canRemoveQuestion = input<boolean>(true);

  /**
   * @description Lifecycle hook that is called after the component's view has been initialized.
   * It updates the answer count based on the current state of the question form group.
   * @returns {void}
   */
  ngOnInit():void {
    this.updateAnswerCount();
  }

  /**
   * @description Emits an event to add a new answer to the question and updates the answer count.
   * @param questionIndex - The index of the question to which the new answer will be added.
   * @returns {void}
   */
  onAddAnswer(questionIndex: number): void{
    this.addAnswerEvent.emit(questionIndex);
    this.updateAnswerCount();
  }

  /**
   * @description Updates the answer count based on the current number of answers in the question form group.
   * @returns {void}
   */
  private updateAnswerCount(): void {
    const answerFormArray = this.questionFormGroup().controls.answers;
    this.answerCount.set(answerFormArray.length);
  }

  /**
   * @description Emits an event to remove an answer from the question and updates the answer count.  
   * @param answerIndex - The index of the answer to be removed.
   * @returns {void}
   */
  onRemoveAnswer(answerIndex: number): void{
    this.removeAnswerEvent.emit({questionIndex: this.questionIndex(), answerIndex: answerIndex});
    this.updateAnswerCount();
  }

  /**
   * @description Emits an event to remove the question from the poll.
   * @returns {void}
   */
  onRemoveQuestion(): void {
    this.removeQuestionEvent.emit(this.questionIndex());
  }

  /**
   * @description Determines if an answer can be cleared based on its content.
   * @param answer - The answer form group to check.
   * @returns {boolean} - True if the answer can be cleared, false otherwise.
   */
  canClearAnswer(answer: FormGroup<AnswerForm>): boolean {
    return answer.controls.text.value.trim().length > 0;
  }

}
