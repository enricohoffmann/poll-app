import { Component, computed, inject, input } from '@angular/core';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';
import { Vote } from '../../../interfaces/vote-interface';

@Component({
  selector: 'app-answer-vote',
  imports: [],
  templateUrl: './answer-vote.html',
  styleUrl: './answer-vote.scss',
})
export class AnswerVote {
  answerIdentifierService = inject(AnswerIdentifierService);
  answerIndex = input.required<number>();
  answerId = input.required<number>();
  questionVotes = input.required<Vote[]>();
  answerVotes = computed(() => {
    return this.questionVotes().filter(vote => vote.answer_id === this.answerId()).length;
  });

  participants = computed(() => {
    const tokens = this.questionVotes().map(
        vote => vote.voter_token
    );

    return new Set(tokens).size;
  });

  percentage = computed(() => {
    return this.answerVotes() / this.participants() * 100;
  });

  getIdentifier(): string {
    return this.answerIdentifierService.getIdentifier(this.answerIndex());
  }
}
