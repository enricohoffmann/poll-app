import { Component, input, computed, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { QuestionForm } from '../../utils/types';
import { SurveyService } from '../../../services/survey-service';
import { AnswerVote } from '../answer-vote/answer-vote';

@Component({
  selector: 'app-question-vote',
  imports: [AnswerVote],
  templateUrl: './question-vote.html',
  styleUrl: './question-vote.scss',
})
export class QuestionVote  {
  surveyService = inject(SurveyService);
  questionFormGroup = input.required<FormGroup<QuestionForm>>();
  questionId = input.required<number>();
  questionIndex = input.required<number>();
  readonly voteList = this.surveyService.voteList;

  questionVotes = computed(() => {
    return this.voteList().filter(
      vote => vote.question_id === this.questionId()
    );
  });


  getAnswers() {
    return this.questionFormGroup().controls.answers.controls;
  }


}
