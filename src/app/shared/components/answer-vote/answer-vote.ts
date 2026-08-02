import { Component, computed, inject, input } from '@angular/core';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';
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
  percentage = input.required<number>();


  /**
   * @description Retrieves the unique identifier for the answer.
   * @returns {string} The unique identifier for the answer.
   */
  getIdentifier(): string {
    return this.answerIdentifierService.getIdentifier(this.answerIndex());
  }

}
