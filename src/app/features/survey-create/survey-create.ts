import { Component, inject, signal, OnInit, output, input } from '@angular/core';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { InputField } from '../../shared/components/input-field/input-field';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray } from '@angular/forms';
import { QuestionCreate } from '../../shared/components/question-create/question-create';
import { SurveyService } from '../../services/survey-service';
import { DropDownMenu } from "../../shared/components/drop-down-menu/drop-down-menu";
import { Category } from '../../interfaces/category-interface';
import { DateField } from '../../shared/components/date-field/date-field';
import { Router } from '@angular/router';
import {
  categorySelectedValidator,
  expiresDateNotPastValidator,
  expiresDatePatternValidator,
  expiresDateValidator,
  noWhitespaceValidator,
  maxWordLengthValidator
} from '../../shared/utils/validators';
import { ValidationService } from '../../services/validation-service';
import { Header } from "../../layout/header/header";
import { AnswerForm, QuestionForm, SurveyForm } from '../../shared/utils/types';
import { DialogOverlayService } from '../../services/dialog-overlay-service';
import { DialogResult } from '../../shared/utils/types';

/**
 * @description This component represents the survey creation page of the application. 
 * It provides a form for users to create new surveys, including adding questions and answers, selecting categories, and setting expiration dates. 
 * The component handles form validation, submission, and navigation after successful survey creation.
 * @implements OnInit
 */
@Component({
  selector: 'app-survey-create',
  imports: [
    Status,
    Button,
    InputField,
    ReactiveFormsModule,
    QuestionCreate,
    DropDownMenu,
    DateField,
    Header
  ],
  templateUrl: './survey-create.html',
  styleUrls: ['./survey-create.scss'],
})
export class SurveyCreate implements OnInit {

  private readonly DIALOG_DELAY = 125;
  private readonly OVERLAY_CLOSE_DELAY = 200;

  /**
   * @description The surveyForm is a FormGroup that represents the structure of the survey creation form.
   * It includes controls for the survey's title, description, expiration date, questions, publication status, and category selection.
   * Each control is initialized with default values and validators to ensure proper input from the user.
   */
  surveyForm = new FormGroup<SurveyForm>({
    id: new FormControl(0, { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80), noWhitespaceValidator(), maxWordLengthValidator(20)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(300), noWhitespaceValidator(), maxWordLengthValidator(50)] }),
    expires_at: new FormControl('', { nonNullable: true, validators: [expiresDatePatternValidator(), expiresDateValidator(), expiresDateNotPastValidator()] }),
    questions: new FormArray<FormGroup>([]),
    is_published: new FormControl(false, { nonNullable: true }),
    category_id: new FormControl(0, { nonNullable: true, validators: [Validators.required, categorySelectedValidator()] })
  });

  currentCategory = signal<Category | null>(null);
  questionsCount = signal<number>(0);
  validationService = inject(ValidationService);
  isSubmitted = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  categoryList = signal<Category[]>([]);
  showSubmitError = signal(false);
  closeCreate = output<void>();
  isModal = input.required<boolean>();


  private readonly surveyService = inject(SurveyService);
  private readonly dialogOverlayService = inject(DialogOverlayService);
  private router = inject(Router);
  private currentSurveyId: number = 0;


  /**
   *@description The constructor initializes the SurveyCreate component. It sets up a subscription to the surveyForm's statusChanges observable to monitor changes in the form's validity. 
   When the form becomes valid, it resets the showSubmitError signal to false, ensuring that any previous error messages are cleared when the user corrects their input. 
   This helps provide immediate feedback to the user as they fill out the survey creation form.
   */
  constructor() {
    this.surveyForm.statusChanges.subscribe(() => {
      if (this.surveyForm.valid) {
        this.showSubmitError.set(false);
      }
    });
  }

  /**
   * @description Initializes the component by adding an initial question to the survey form.
   * This method is called during the component's lifecycle hook (ngOnInit) to ensure that the survey form starts with at least one question.
   * It utilizes the addQuestion method to create and append a new question FormGroup to the questions FormArray within the surveyForm.
   * @returns {Promise<void>} A promise that resolves when the initialization process is complete.
   */
  async ngOnInit(): Promise<void> {
    await this.surveyService.getCategories();
    this.categoryList.set(this.surveyService.categoriesList());
    this.addQuestion();
  }

  /**
   * @description Handles the submission of the survey creation form. It first marks all fields as touched to trigger validation messages and checks for any validation errors. 
   * If the form is valid, it sets the isSubmitted signal to true, updates the is_published control to true, and calls the surveyService's handleAddSurvey method to save the survey. 
   * Upon successful submission, it stores the returned survey ID and calls afterCreateSurvey to display a success dialog and overlay.
   * @returns {Promise<void>} A promise that resolves when the submission process is complete.
   */
  async onSubmit(): Promise<void> {
    this.setAllFieldTouched();
    this.handleSubmitError();
    if (this.surveyForm.valid) {
      this.trimFormValues();
      this.isSubmitted.set(true);
      this.surveyForm.get('is_published')?.setValue(true);
      const surveyAddResult = await this.surveyService.handleAddSurvey(this.surveyForm);
      if (surveyAddResult > 0) {
        this.currentSurveyId = surveyAddResult;
        this.afterCreateSurvey();
      }
    }
  }

  /**
   * @description Handles the cancellation of the survey creation process. If the survey form is not dirty (i.e., no changes have been made), it emits the closeCreate event to close the survey creation view.
   * If the form is dirty, it opens a confirmation dialog to ask the user if they want to discard their changes. 
   * Depending on the user's response in the confirmation dialog, it either discards the survey or keeps the user on the survey creation page.
   * @returns {void}
   */
  onCancel(): void {
    if (!this.surveyForm.dirty) {
      this.closeCreate.emit();
      return;
    }

    this.openDiscardDialog();

  }

  /**
   * @description Opens a confirmation dialog to ask the user if they want to discard their changes in the survey creation form.
   * It uses the DialogOverlayService to display a dialog with a title and message. 
   * The user's response (confirm or cancel) is handled by the handleDiscardResult method, which either discards the survey or keeps the user on the survey creation page based on their choice.
   * @returns {void}
   */
  private openDiscardDialog(): void {
    this.dialogOverlayService
      .openConfirmDialog(
        'Discard survey?',
        'Your entered survey data will be lost.'
      )
      .subscribe(result => this.handleDiscardResult(result));
  }

  /**
   * @description Handles the result of the discard confirmation dialog. If the user confirms that they want to discard their changes, it calls the discardSurvey method to reset the survey form and emit the closeCreate event.
   * If the user cancels, it does nothing, allowing them to continue editing the survey.
   * @param result The result of the confirmation dialog ('confirm' or 'cancel').
   * @returns {void}
   */
  private handleDiscardResult(result: DialogResult): void {
    if (result === 'confirm') {
      this.discardSurvey();
    }
  }

  /**
   * @description Discards the current survey creation process and resets the survey form to its initial state.
   * This method is called when the user confirms that they want to discard their changes in the survey creation form. 
   * It marks the surveyForm as untouched and pristine, effectively resetting any modifications made by the user. 
   * After resetting the form, it calls onCancel to handle any additional cleanup or navigation logic associated with discarding the survey.
   * @returns {void}
   */
  discardSurvey(): void {
    this.surveyForm.markAsUntouched();
    this.surveyForm.markAsPristine();
    this.onCancel();
  }

  /**
   * @description Trims whitespace from the title, description, questions, and answers in the survey form before submission.
   * This method ensures that any leading or trailing whitespace is removed from the input values, which helps maintain data integrity and prevents validation errors related to whitespace.
   * It calls trimQuestionAndAnswers to handle trimming for each question and its associated answers.
   * @returns {void}
   */
  private trimFormValues(): void {
    this.surveyForm.controls.title.setValue(
      this.surveyForm.controls.title.value.trim()
    );

    this.surveyForm.controls.description.setValue(
      this.surveyForm.controls.description.value?.trim() || null
    );

    this.trimQuestionAndAnswers();
  }

  /**
   * @description Trims whitespace from the text of each question and its associated answers in the survey form.
   * This method iterates through each question in the questions FormArray and trims the text of the question itself, as well as the text of each answer within that question. 
   * It ensures that all input values are free from leading or trailing whitespace before the survey form is submitted.
   * @returns {void}
   */
  private trimQuestionAndAnswers(): void {
    this.questions.controls.forEach(question => {
      question.controls.text.setValue(
        question.controls.text.value.trim()
      );

      question.controls.answers.controls.forEach(answer => {
        answer.controls.text.setValue(
          answer.controls.text.value.trim()
        );
      });
    });
  }

  /**
   * @description Checks the validity of the surveyForm and updates the showSubmitError signal accordingly.
   * If the form is invalid, it sets showSubmitError to true, indicating that there are validation errors that need to be addressed before submission.
   * @returns {void}
   */
  handleSubmitError(): void {
    if (!this.surveyForm.valid) {
      this.showSubmitError.set(true);
      return;
    }

    this.showSubmitError.set(false);
  }

  /**
   * @description Creates a new question FormGroup with default values and two initial answer FormGroups.
   * @returns {FormGroup<QuestionForm>} The newly created question FormGroup.
   */
  private createNewQuestion(): FormGroup<QuestionForm> {
    const questionGroup: FormGroup<QuestionForm> = this.createQuestionGroup();
    const answers = questionGroup.controls.answers;
    answers.push(this.createAnswerGroup());
    answers.push(this.createAnswerGroup());
    return questionGroup;
  }

  /**
   * @description Creates a new question FormGroup with default values.
   * @returns {FormGroup<QuestionForm>} The newly created question FormGroup.
   */
  private createQuestionGroup(): FormGroup<QuestionForm> {
    const questionFormGroup: FormGroup<QuestionForm> = new FormGroup<QuestionForm>({
      id: new FormControl(0, { nonNullable: true }),
      text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(120), noWhitespaceValidator(), maxWordLengthValidator(20)] }),
      allow_multiple_answers: new FormControl(false, { nonNullable: true }),
      sort_order: new FormControl(0, { nonNullable: true }),
      answers: new FormArray<FormGroup<AnswerForm>>([])
    });
    return questionFormGroup;
  }

  /**
   * @description Creates a new answer FormGroup with default values.
   * @returns {FormGroup<AnswerForm>} The newly created answer FormGroup.
   */
  private createAnswerGroup(): FormGroup<AnswerForm> {
    const answerFormGroup: FormGroup<AnswerForm> = new FormGroup<AnswerForm>({
      id: new FormControl(0, { nonNullable: true }),
      text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80), noWhitespaceValidator(), maxWordLengthValidator(20)] }),
      select: new FormControl(false, { nonNullable: true }),
      sort_order: new FormControl(0, { nonNullable: true })
    });
    return answerFormGroup;
  }

  /**
   * @description Getter for the questions FormArray within the surveyForm.
   * This allows easy access to the questions array for adding, removing, and manipulating questions in the survey creation form.
   * @returns {FormArray<FormGroup<QuestionForm>>} The FormArray containing question FormGroups.
   */
  get questions(): FormArray<FormGroup<QuestionForm>> {
    return this.surveyForm.controls.questions;
  }

  /**
   * @description Getter for the answers FormArray of a specific question.
   * @param questionIndex The index of the question within the questions FormArray.
   * @returns {FormArray<FormGroup<AnswerForm>>} The FormArray containing answer FormGroups for the specified question.
   */
  getAnswers(questionIndex: number): FormArray<FormGroup<AnswerForm>> {
    const question = this.questions.at(questionIndex);
    if (!question) { return new FormArray<FormGroup<AnswerForm>>([]); }
    return question.controls.answers;
  }

  /**
   * @description Adds a new answer FormGroup to the answers FormArray of the specified question.
   * @param questionIndex The index of the question within the questions FormArray.
   * @returns {void}
   */
  addAnswer(questionIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.push(this.createAnswerGroup());
  }

  /**
   * @description Removes an answer FormGroup from the answers FormArray of the specified question.
   * Ensures that at least two answers remain for each question.
   * @param questionIndex The index of the question within the questions FormArray.
   * @param answerIndex The index of the answer within the answers FormArray.
   * @returns {void}
   */
  removeAnswer({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
      return;
    }

    this.clearAnswerContent(answers, answerIndex);

  }

  /**
   * @description Clears the content of a specific answer FormGroup within the answers FormArray.
   * It resets the text control to an empty string and marks the answer as untouched and pristine.
   * @param answers The FormArray containing the answer FormGroups.
   * @param answerIndex The index of the answer to be cleared.
   * @returns {void}
   */
  clearAnswerContent(answers: FormArray<FormGroup<AnswerForm>>, answerIndex: number): void {
    const answer = answers.at(answerIndex);
    answer.controls.text.setValue('');
    answer.markAsUntouched();
    answer.markAsPristine();
  }

  /**
   * @description Adds a new question FormGroup to the questions FormArray within the surveyForm.
   * It also updates the questionsCount signal to reflect the new number of questions.
   * This method is typically called when the user wants to add another question to the survey.
   * @returns {void}
   */
  addQuestion(): void {
    this.surveyForm.controls.questions.push(this.createNewQuestion());
    this.questionsCount.set(this.surveyForm.controls.questions.length);
  }

  /**
   * @description Removes a question FormGroup from the questions FormArray within the surveyForm.
   * Ensures that at least one question remains in the survey.
   * @param questionIndex The index of the question to be removed.
   * @returns {void}
   */
  removeQuestion(questionIndex: number): void {
    const questions = this.questions;
    if (questions.length > 1) {
      questions.removeAt(questionIndex);
      this.questionsCount.set(questions.length);
      return;
    }

    this.clearQuestionContent(questionIndex);
  }

  /**
   * @description Clears the content of a specific question FormGroup within the questions FormArray.
   * It resets the text control and all associated answer controls to their default values, and marks the question as untouched and pristine.
   * @param questionIndex The index of the question to be cleared.
   * @returns {void}
   */
  private clearQuestionContent(questionIndex: number): void {
    const question = this.questions.at(questionIndex);
    question.controls.text.setValue('');
    question.controls.allow_multiple_answers.setValue(false);
    this.clearAnswerContentOfQuestion(question);
    question.markAsPristine();
    question.markAsUntouched();
  }

  /**
   * @description Clears the content of all answer FormGroups within a specific question FormGroup.
   * It resets the text control of each answer to an empty string and marks them as untouched and pristine.
   * @param question The question FormGroup whose answers are to be cleared. 
   * @returns {void}
   */
  private clearAnswerContentOfQuestion(question: FormGroup<QuestionForm>): void {
    question.controls.answers.controls.forEach(answer => {
      answer.controls.text.setValue('');
      answer.markAsUntouched();
      answer.markAsPristine();
    });
  }

  /**
   * @description Determines whether the trash icon for a specific question can be used to remove that question.
   * A question can be removed if there is more than one question in the survey, or if the question has any text or answers filled in.
   * @param questionIndex The index of the question to check.
   * @returns {boolean} True if the trash icon can be used to remove the question, false otherwise.
   */
  canUseQuestionTrash(questionIndex: number): boolean {
    const question = this.questions.at(questionIndex);
    if (!question) { return false; }
    if (this.questions.length > 1) { return true; }

    const hasQuestionText = question.controls.text.value.trim().length > 0;
    const hasAnswerText = question.controls.answers.controls.some(answer =>
      answer.controls.text.value.trim().length > 0
    );

    return hasQuestionText || hasAnswerText;
  }

  /**
   * @description Handles the selection of a category for the survey.
   * Updates the currentCategory signal and sets the category_id in the surveyForm.
   * @param category The selected category.
   * @returns {void}
   */
  onChooseCategory(category: Category | null): void {
    this.currentCategory.set(category);
    if (!category) { return; }
    this.surveyForm.get('category_id')?.setValue(category.id);
  }

  /**
   * @description This private method is called after a survey has been successfully created.
   * It sets the showOverlay signal to true, which likely triggers a visual overlay in the UI.
   * After a short delay (defined by DIALOG_DELAY), it sets the showDialog signal to true, which likely displays a dialog to inform the user of the successful creation.
   * @returns {void}
   */
  private afterCreateSurvey(): void {
    this.dialogOverlayService.openSuccessDialog('Your survey is now published!').subscribe(() => this.onSuccessDialogClose());
  }

  /**
   * @description This method is called when the success dialog is closed by the user.
   * It sets the showDialog signal to false, hiding the dialog.
   * After a short delay (defined by OVERLAY_CLOSE_DELAY), it sets the showOverlay signal to false, hiding the overlay.
   * Finally, it calls the callPublishedSurvey method to navigate the user to the newly created survey's view page.
   * @returns {void}
   */
  onSuccessDialogClose(): void {
    this.callPublishedSurvey();
  }

  /**
   * @description Marks all fields in the surveyForm as touched to trigger validation messages.
   * This method is called before form submission to ensure that all validation errors are displayed to the user.
   * It helps in providing immediate feedback on any invalid or incomplete fields in the survey creation form.
   * @returns {void}
   */
  private setAllFieldTouched(): void {
    this.surveyForm.markAllAsTouched();
  }

  /**
   * @description Navigates the user to the view page of the newly created survey.
   * It uses the Angular Router to navigate to the '/view' route, passing the currentSurveyId as a parameter.
   * This method is called after the survey has been successfully created and the success dialog has been closed.
   * @returns {void}
   */
  private callPublishedSurvey(): void {
    this.closeCreate.emit();
    setTimeout(() => {
      this.router.navigate(['/view', this.currentSurveyId]);
    });
  }

  /**
   * @description Prevents the default form submission behavior when the Enter key is pressed, except when the focus is on a textarea element.
   * This method is typically used to avoid accidental form submissions when the user is filling out input fields.
   * @param event 
   * @returns {void}
   */
  preventEnterSubmit(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target;

    if (target instanceof HTMLTextAreaElement) { return; }

    if (target instanceof HTMLInputElement) {
      keyboardEvent.preventDefault();
    }
  }

}
