import { Component, inject, signal, OnDestroy, OnInit, computed } from '@angular/core';
import { Header } from '../../layout/header/header';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey-service';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../../interfaces/question-with-answers-interface';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { IsoDateToGerman } from '../../pips/custom-pips';
import { QuestionView } from '../../shared/components/question-view/question-view';
import { FormGroup, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { Answer } from '../../interfaces/answer-interface';
import { AnswerForm, QuestionForm, VoteFrom } from '../../shared/utils/types';
import { QuestionVote } from '../../shared/components/question-vote/question-vote';
import { questionAnsweredValidator } from '../../shared/utils/validators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ResultAccordeon } from '../../shared/components/result-accordeon/result-accordeon';
import { VoterTokenService } from '../../services/voter-token-service';
import { SurveyCreate } from '../survey-create/survey-create';
import { CreateSurveyModal } from '../../shared/components/create-survey-modal/create-survey-modal';
import { Dialog } from '../../shared/components/dialog/dialog';

/**
 * @description The SurveyView component is responsible for displaying a survey along with its questions and answers.
 * It allows users to submit their votes for the survey questions and view the results.
 * The component fetches survey data and questions from the SurveyService and manages the state of the survey view.
 * It also handles form validation and submission, ensuring that users can only submit valid responses.
 * The component is designed to be responsive, adapting its layout based on the screen size.
 * It uses Angular's reactive forms to manage user input and provides feedback on the submission status.
 * @implements {OnInit} - Initializes the component and fetches survey data on load.
 * @implements {OnDestroy} - Cleans up any subscriptions or state when the component is destroyed.
 */
@Component({
  selector: 'app-survey-view',
  imports: [
    Header,
    Status,
    Button,
    IsoDateToGerman,
    QuestionView,
    ReactiveFormsModule,
    QuestionVote,
    ResultAccordeon,
    SurveyCreate,
    CreateSurveyModal,
    Dialog
  ],
  templateUrl: './survey-view.html',
  styleUrls: ['./survey-view.scss'],
})
export class SurveyView implements OnDestroy, OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private surveyId = 0;
  private readonly surveyService = inject(SurveyService);
  private readonly voterTokenService = inject(VoterTokenService);
  survey = signal<SurveyWithCategory | null>(null);
  questionsAndAnswers = signal<QuestionWithAnswers[]>([]);
  isLoading = signal<boolean>(true);
  openResultMobile = signal<boolean>(false);
  showCreateSurvey = signal<boolean>(false);
  hasAlreadyVoted = signal(false);
  isPastDue = signal(false);
  hasJustSubmitted = signal(false);
  showOverlay = signal(false);
  showDialog = signal(false);
  selectedAnswerIds = signal<number[]>([]);
  readonly storedVotes  = this.surveyService.voteList;

  canParticipate = computed(() =>
    !this.hasAlreadyVoted() &&
    !this.isPastDue() &&
    !this.hasJustSubmitted()
  );

  /**
   * @description The voteForm is a FormGroup that contains a FormArray of questions.
   * Each question is represented by a FormGroup that includes the question's ID, text, whether multiple answers are allowed,
   * the sort order, and a FormArray of answers. Each answer is also represented by a FormGroup containing the answer's ID,
   * sort order, text, and a boolean indicating whether it has been selected.
   * This structure allows for dynamic addition and removal of questions and answers, as well as validation of user input.
   * The form is used to collect user votes for the survey questions and submit them to the server.
   * @type {FormGroup<VoteFrom>}
   * @memberof SurveyView
   */
  voteForm = new FormGroup<VoteFrom>({
    questions: new FormArray<FormGroup<QuestionForm>>([])
  });

  private breakpointObserver = inject(BreakpointObserver);

  /**
   * @description A computed signal that determines if the current viewport width is less than or equal to 900 pixels.
   * This is used to adapt the layout and behavior of the component for mobile devices.
   * It leverages Angular's BreakpointObserver to listen for changes in the viewport size and updates the signal accordingly.
   * The initial value is set to false, indicating that the default assumption is that the viewport is larger than 900 pixels.
   * @readonly
   * @type {Signal<boolean>}
   * @memberof SurveyView
   */
  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 900px)').pipe(
      map(result => result.matches)
    ), { initialValue: false }
  );

  /**
   * @description Lifecycle hook that is called after the component has been initialized.
   * It retrieves the survey ID from the route parameters and initializes the survey view by fetching the survey data and questions.
   * The method handles asynchronous operations and ensures that the component's state is updated accordingly.
   * It also manages the loading state of the component, indicating when data is being fetched and when it is ready for display.
   * @returns {Promise<void>}
   * @memberof SurveyView
   */
  async ngOnInit(): Promise<void> {
    const surveyIdParam = this.activatedRoute.snapshot.paramMap.get('surveyId');
    this.surveyId = Number(surveyIdParam);
    this.initializeSurveyView();
  }

  /**
   * @description Lifecycle hook that is called when the component is destroyed.
   * It clears the current question IDs from the SurveyService to prevent memory leaks and ensure that the service's state is reset.
   * This is important for maintaining the integrity of the application, especially when navigating away from the survey view.
   * The method does not return any value and is primarily used for cleanup purposes.
   * @memberof SurveyView
   */
  ngOnDestroy(): void {
    this.surveyService.clearCurrentQuestionIds();
    document.body.style.overflow = '';
  }

  /**
   * @description Opens the create survey modal by setting the showCreateSurvey signal to true and preventing body scrolling.
   * This method is typically called when the user wants to create a new survey, allowing them to input survey details in a modal dialog.
   * It modifies the document's body style to prevent scrolling while the modal is open, enhancing the user experience.
   * @memberof SurveyView
   * @returns {void}
   */
  openCreateSurvey(): void {
    this.showCreateSurvey.set(true);
    document.body.style.overflow = 'hidden';
  }

  /**
   * @description Closes the create survey modal by setting the showCreateSurvey signal to false and restoring body scrolling.
   * This method is typically called when the user has finished creating a survey or decides to cancel the operation.
   * It modifies the document's body style to allow scrolling again, ensuring that the user can interact with the rest of the page.
   * @memberof SurveyView
   * @returns {void}
   */
  closeCreateSurvey(): void {
    this.showCreateSurvey.set(false);
    document.body.style.overflow = '';
  }

  /**
   * @description Initializes the survey view by fetching the survey data and questions from the SurveyService.
   * It uses Promise.all to perform both asynchronous operations concurrently, improving performance.
   * Once the data is fetched, it updates the component's state with the survey and questions, creates the question form array,
   * initializes the votes, and checks if the user can participate in the survey based on its expiration status and whether they have already submitted their responses.
   * The method also manages the loading state of the component, ensuring that it is set to false once all operations are complete.
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyView
   */
  private async initializeSurveyView(): Promise<void> {
    try {
      const [survey, questions] = await Promise.all([
        this.surveyService.getSurveyById(this.surveyId),
        this.surveyService.getQuestionsWithAnswersBySurveyId(this.surveyId)
      ]);

      this.survey.set(survey);
      this.questionsAndAnswers.set(questions);
      this.createQuestionFormArray(questions);
      await this.initializeVotes(questions);
      this.canParticipateInSurvey(survey);

    } finally { this.isLoading.set(false); }
  }


  /**
   * @description Determines if the user can participate in the survey based on its expiration status and whether they have already submitted their responses.
   * It checks if the survey is past due and if the user has already filled it out using the SurveyService and VoterTokenService.
   * If either condition is true, the survey is disabled for the user, preventing further interaction.
   * @private
   * @memberof SurveyView
   * @param {SurveyWithCategory} survey - The survey to check participation eligibility for.
   * @returns {void}
   */
  private canParticipateInSurvey(survey: SurveyWithCategory): void {
    this.isPastDue.set(this.checkIfSurveyIsPastDue(survey));
    this.hasAlreadyVoted.set(this.surveyService.checkHasAlreadyFilled(this.voterTokenService.getToken()));
  }

  /**
   * @description Checks if the survey has expired based on its expiration date.
   * If the survey has no expiration date, it is considered not past due.
   * The method compares the current date with the survey's expiration date to determine if the survey is past due.
   * @private
   * @memberof SurveyView
   * @param survey 
   * @returns {boolean} - True if the survey is past due, false otherwise.
   */
  private checkIfSurveyIsPastDue(survey: SurveyWithCategory): boolean {
    if (!survey.expires_at) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expires = new Date(survey.expires_at);
    expires.setHours(0, 0, 0, 0);

    return today > expires;
  }

  /**
   * @description Creates a FormArray of question FormGroups based on the provided questions.
   * @param {QuestionWithAnswers[]} questions - The list of questions to create form groups for.
   * @private
   * @memberof SurveyView
   * @returns {void}
   */
  private createQuestionFormArray(questions: QuestionWithAnswers[]): void {
    const questionFormArray = this.voteForm.controls.questions;
    questionFormArray.clear();
    for (const question of questions) {
      questionFormArray.push(this.createQuestionFormGroup(question));
    }
  }

  /**
   * @description Initializes the votes for the provided questions by setting the current question IDs in the SurveyService and loading the votes.
   * @param {QuestionWithAnswers[]} questions - The list of questions to initialize votes for.
   * @private
   * @memberof SurveyView
   * @returns {Promise<void>}
   */
  private async initializeVotes(questions: QuestionWithAnswers[]): Promise<void> {
    this.surveyService.setCurrentQuestionIds(this.getQuestionIds(questions));
    await this.surveyService.loadVotesByQuestionIds();
  }

  /**
   * @description Extracts the IDs of the provided questions.
   * @param {QuestionWithAnswers[]} questions - The list of questions to extract IDs from.
   * @private
   * @memberof SurveyView
   * @returns {number[]} - An array of question IDs.
   */
  private getQuestionIds(questions: QuestionWithAnswers[]): number[] {
    return questions.map(question => question.id);
  }

  /**
   * @description Creates a FormGroup for the provided question.
   * @param {QuestionWithAnswers} question - The question to create a form group for.
   * @private
   * @memberof SurveyView
   * @returns {FormGroup<QuestionForm>} - The created FormGroup for the question.
   */
  private createQuestionFormGroup(question: QuestionWithAnswers): FormGroup<QuestionForm> {
    return new FormGroup<QuestionForm>({
      id: new FormControl(question.id, { nonNullable: true }),
      text: new FormControl(question.text, { nonNullable: true }),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, { nonNullable: true }),
      sort_order: new FormControl(question.sort_order, { nonNullable: true }),
      answers: this.fillAnswers(question.answers)
    }, { validators: questionAnsweredValidator() });
  }

  /**
   * @description Creates a FormArray of answer FormGroups based on the provided answers.
   * @param {Answer[]} answers - The list of answers to create form groups for.
   * @private
   * @memberof SurveyView
   * @returns {FormArray<FormGroup<AnswerForm>>} - The created FormArray of answer FormGroups.
   */
  private fillAnswers(answers: Answer[]): FormArray<FormGroup<AnswerForm>> {
    const answersFormArray = new FormArray<FormGroup<AnswerForm>>([]);

    for (let aIndex = 0; aIndex < answers.length; aIndex++) {
      answersFormArray.push(this.createAnswerFormGroup(answers[aIndex]));
    }

    return answersFormArray;
  }

  /**
   * @description Creates a FormGroup for the provided answer.
   * @param {Answer} answer - The answer to create a form group for.
   * @private
   * @memberof SurveyView
   * @returns {FormGroup<AnswerForm>} - The created FormGroup for the answer.
   */
  private createAnswerFormGroup(answer: Answer): FormGroup<AnswerForm> {
    return new FormGroup<AnswerForm>({
      id: new FormControl(answer.id, { nonNullable: true }),
      sort_order: new FormControl(answer.sort_order, { nonNullable: true }),
      text: new FormControl(answer.text, { nonNullable: true }),
      select: new FormControl(false, { nonNullable: true })
    });

  }

  /**
   * @description Returns the left column of questions for display purposes.
   * It filters the questions in the voteForm to include only those at even indices.
   * This is useful for creating a two-column layout where questions are distributed evenly between the left and right columns.
   * @readonly
   * @type {FormGroup<QuestionForm>[]}
   * @memberof SurveyView
   * @returns {FormGroup<QuestionForm>[]} - An array of FormGroups representing the left column of questions.
   */
  get leftQuestions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls.filter(
      (_, index) => index % 2 === 0
    );
  }

  /**
   * @description Returns the right column of questions for display purposes.
   * It filters the questions in the voteForm to include only those at odd indices.
   * This is useful for creating a two-column layout where questions are distributed evenly between the left and right columns.
   * @readonly
   * @type {FormGroup<QuestionForm>[]}
   * @memberof SurveyView
   * @returns {FormGroup<QuestionForm>[]} - An array of FormGroups representing the right column of questions.
   */
  get rightQuestions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls.filter(
      (_, index) => index % 2 === 1
    );
  }

  /**
   * @description Returns the array of question FormGroups from the voteForm.
   * This provides access to all the questions in the form, allowing for iteration and manipulation of the question data.
   * @readonly
   * @type {FormGroup<QuestionForm>[]}
   * @memberof SurveyView
   * @returns {FormGroup<QuestionForm>[]} - An array of FormGroups representing all the questions in the voteForm.
   */
  get questions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls;
  }

  /**
   * @description Checks if the survey has a description with more than 2 characters.
   * @returns {boolean} - True if the survey has a description longer than 2 characters, false otherwise.
   */
  hasDescription(): boolean {
    const description = this.survey()?.description;
    if (!description) {
      return false;
    } else {
      return description.length > 2;
    }
  }

  /**
   * @description Toggles the visibility of the survey results on mobile devices.
   * @param {boolean} see - True to show the results, false to hide them.
   */
  toggleSeeResult(see: boolean): void {
    this.openResultMobile.set(see);
  }

  /**
   * @description Handles the submission of the survey form.
   * It marks all form controls as touched and, if the form is valid, submits the votes using the survey service.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   */
  async onSubmit(): Promise<void> {
    if (!this.canParticipate()) { return; }

    this.voteForm.markAllAsTouched();
    this.hasJustSubmitted.set(true);
    this.showCompleteMessage();

    if (this.voteForm.valid) {
      await this.surveyService.handleAddVotes(this.voteForm);
    }
  }

  private showCompleteMessage(): void {
    this.showOverlay.set(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.showDialog.set(true);
      });
    });
  }

  onMessageDialogClose(): void {
    this.showDialog.set(false);
    setTimeout(() => {
      this.showOverlay.set(false);
    }, 125);
  }

  private updateSelectedAnswerIds(): void {
  const ids = this.voteForm.controls.questions.controls.flatMap(question =>
    question.controls.answers.controls
      .filter(answer => answer.controls.select.value)
      .map(answer => answer.controls.id.value)
  );

  this.selectedAnswerIds.set(ids);
}


}
