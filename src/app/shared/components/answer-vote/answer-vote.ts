import { Component, computed, inject, input } from '@angular/core';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';
import { Vote } from '../../../interfaces/vote-interface';
import { ResultRounding } from '../../../pips/custom-pips';


/**
 * @description Component for displaying the voting results of an answer within a poll question.
 */
@Component({
  selector: 'app-answer-vote',
  imports: [ResultRounding],
  templateUrl: './answer-vote.html',
  styleUrls: ['./answer-vote.scss'],
})
export class AnswerVote {
  answerIdentifierService = inject(AnswerIdentifierService);
  answerIndex = input.required<number>();
  answerId = input.required<number>();
  questionVotes = input.required<Vote[]>();

  /**
   * @description Computes the total number of votes for the specific answer.
   * @returns {number} The count of votes for the answer.
   */
  answerVotes = computed(() => {
    return this.questionVotes().filter(vote => vote.answer_id === this.answerId()).length;
  });

  /**
   * @description Computes the total number of unique participants who have voted in the poll question.
   * @returns {number} The count of unique participants.
   */
  participants = computed(() => {
    const tokens = this.questionVotes().map(vote => vote.voter_token);
    return new Set(tokens).size;
  });

  /**
   * @description Computes the percentage of votes for the specific answer relative to the total number of participants.
   * @returns {number} The percentage of votes for the answer, constrained between 0 and 100.
   */
  percentage = computed(() => {
    const value = this.answerVotes() / this.participants() * 100;
    return Math.min(100, Math.max(0, value));
  });

  /**
   * @description Retrieves the unique identifier for the answer.
   * @returns {string} The unique identifier for the answer.
   */
  getIdentifier(): string {
    return this.answerIdentifierService.getIdentifier(this.answerIndex());
  }
}
