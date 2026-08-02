import { Component, input, computed, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { AnswerForm, QuestionForm } from '../../utils/types';
import { SurveyService } from '../../../services/survey-service';
import { AnswerVote } from '../answer-vote/answer-vote';

/**
 * @description Component for voting on a question in the poll.
 */
@Component({
  selector: 'app-question-vote',
  imports: [AnswerVote],
  templateUrl: './question-vote.html',
  styleUrls: ['./question-vote.scss'],
})
export class QuestionVote {
  surveyService = inject(SurveyService);
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionId = input.required<number>();
  questionIndex = input.required<number>();
  previewAnswerIds = input<number[]>([]);
  previewEnabled = input<boolean>(false);
  readonly voteList = this.surveyService.voteList;

  /**
   * @description Computes the votes for the current question.
   * @returns {Array} An array of votes for the current question.
   */
  questionVotes = computed(() => {
    return this.voteList().filter(
      vote => vote.question_id === this.questionId()
    );
  });

  /**
   * @description Retrieves the answers from the question form group.
   * @returns {FormGroup<AnswerForm>[]} An array of answer controls for the current question.
   */
  getAnswers(): FormGroup<AnswerForm>[] {
    return this.questionFormGroup().controls.answers.controls;
  }


}
