import { Component, input, computed, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { AnswerForm, QuestionForm } from '../../utils/types';
import { SurveyService } from '../../../services/survey-service';
import { AnswerVote } from '../answer-vote/answer-vote';

/**
 * @description The QuestionVote component is responsible for displaying the voting results for a specific question in a survey. It retrieves the votes from the SurveyService and computes the vote counts, participant counts, and percentages for each answer option. The component also supports a preview mode that allows users to see how their selections would affect the results without actually submitting their votes.
 * @property {FormGroup<QuestionForm>} questionFormGroup - The form group containing the question and its answers.
 * @property {number} questionId - The unique identifier for the current question.
 * @property {number} questionIndex - The index of the current question in the survey.
 * @property {number[]} previewAnswerIds - An array of answer IDs that are currently selected in preview mode.
 * @property {boolean} previewEnabled - A flag indicating whether the preview mode is enabled.
 * @property {Signal<Vote[]>} voteList - A signal containing the list of votes retrieved from the SurveyService.
 * @method {FormGroup<AnswerForm>[]} getAnswers() - Retrieves the answers from the question form group.
 * @method {number} getVoteCount(answerId: number) - Computes the total votes for a specific answer, including any preview selections.
 * @method {number} getParticipantCount() - Computes the total number of unique participants who have voted for the current question, including any preview selections.
 * @method {number} getPercentage(answerId: number) - Computes the percentage of votes for a specific answer based on the total participant count.
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

  /**
   * @description Computes the total votes for a specific answer, including any preview selections.
   * @param answerId The unique identifier for the answer option.
   * @returns {number} The total votes for the specified answer, including any preview selections.
   */
  getVoteCount(answerId: number): number {
    const storedCount = this.questionVotes()
      .filter(vote => vote.answer_id === answerId).length;

    const previewCount = this.previewEnabled() &&
      this.previewAnswerIds().includes(answerId) ? 1 : 0;

    return storedCount + previewCount;
  }

  /**
   * @description Computes the total number of unique participants who have voted for the current question, including any preview selections.
   * @returns {number} The total number of unique participants who have voted for the current question, including any preview selections.
   */
  getParticipantCount(): number {
    const storedParticipants = new Set(this.questionVotes().map(vote => vote.voter_token)).size;

    const currentQuestionAnswerIds = this.getAnswers()
      .map(answer => answer.controls.id.value);

    const hasPreviewSelection = currentQuestionAnswerIds.some(answerId =>
      this.previewAnswerIds().includes(answerId)
    );

    return storedParticipants + (this.previewEnabled() && hasPreviewSelection ? 1 : 0);
  }

  /**
   * @description Computes the percentage of votes for a specific answer based on the total participant count.
   * @param answerId The unique identifier for the answer option.
   * @returns {number} The percentage of votes for the specified answer based on the total participant count.
   */
  getPercentage(answerId: number): number {
    const participants = this.getParticipantCount();

    if (participants === 0) { return 0; }

    return Math.round((this.getVoteCount(answerId) / participants) * 100);
  }


}
