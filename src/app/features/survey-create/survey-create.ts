import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { Dialog } from '../../shared/components/dialog/dialog';
import { categorySelectedValidator, expiresDateNotPastValidator, expiresDatePatternValidator, expiresDateValidator } from '../../shared/utils/validators';
import { ValidationService } from '../../services/validation-service';
import { Header } from "../../layout/header/header";
import { AnswerForm, QuestionForm, SurveyForm } from '../../shared/utils/types';

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
    Dialog,
    Header
],
  templateUrl: './survey-create.html',
  styleUrls: ['./survey-create.scss'],
})
export class SurveyCreate implements OnInit {

  private readonly DIALOG_DELAY = 125;
  private readonly OVERLAY_CLOSE_DELAY = 1400;

  currentCategory = signal<Category | null>(null);

  /**
   * @description The surveyForm is a FormGroup that represents the structure of the survey creation form.
   * It includes controls for the survey's title, description, expiration date, questions, publication status, and category selection.
   * Each control is initialized with default values and validators to ensure proper input from the user.
   */
  surveyForm = new FormGroup<SurveyForm>({
    id: new FormControl(0, {nonNullable: true}),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(300)] }),
    expires_at: new FormControl('', { nonNullable: true, validators: [expiresDatePatternValidator(), expiresDateValidator(), expiresDateNotPastValidator()] }),
    questions: new FormArray<FormGroup>([]),
    is_published: new FormControl(false, {nonNullable: true}),
    category_id: new FormControl(0, { nonNullable: true, validators: [Validators.required, categorySelectedValidator()] })
  });

  questionsCount = signal<number>(0);
  showDialog = signal<boolean>(false);
  showOverlay = signal<boolean>(false);
  validationService = inject(ValidationService);
  isSubmitted = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  categoryList = signal<Category[]>([]);

  private surveyService = inject(SurveyService);
  private router = inject(Router);
  private currentSurveyId:number = 0;
  

  /**
   * @description Initializes the component by adding an initial question to the survey form.
   * This method is called during the component's lifecycle hook (ngOnInit) to ensure that the survey form starts with at least one question.
   * It utilizes the addQuestion method to create and append a new question FormGroup to the questions FormArray within the surveyForm.
   */
  ngOnInit(): void {
    this.categoryList.set(this.surveyService.categoriesList());
    this.addQuestion();
  }

  /**
   * @description Handles the submission of the survey creation form.
   * It first marks all form fields as touched to trigger validation messages.
   * If the form is valid, it sets the survey's publication status to true and calls the SurveyService to handle adding the survey.
   * Upon successful addition (indicated by a positive survey ID), it stores the current survey ID and triggers post-creation actions, such as showing a dialog and overlay.
   * The method is asynchronous to accommodate the service call and ensure proper handling of the survey creation process.
   * @returns {Promise<void>} A promise that resolves when the submission process is complete.
   */
  async onSubmit(): Promise<void> {
    this.setAllFieldTouched();
    if (this.surveyForm.valid) {
      this.isSubmitted.set(true);
      this.surveyForm.get('is_published')?.setValue(true);
      const surveyAddResult = await this.surveyService.handleAddSurvey(this.surveyForm);
      if(surveyAddResult > 0){
        this.currentSurveyId = surveyAddResult;
        this.afterCreateSurvey();
      }
    }
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
      id: new FormControl(0, {nonNullable: true}),
      text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(120)] }),
      allow_multiple_answers: new FormControl(false, { nonNullable: true }),
      sort_order: new FormControl(0, {nonNullable: true}),
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
      id: new FormControl(0, {nonNullable: true}),
      text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
      select: new FormControl(false, {nonNullable: true}),
      sort_order: new FormControl(0, {nonNullable: true})
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
    }
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
    }
  }

  /**
   * @description Handles the selection of a category for the survey.
   * Updates the currentCategory signal and sets the category_id in the surveyForm.
   * @param category The selected category.
   */
  onChooseCategory(category: Category | null): void {
    this.currentCategory.set(category);
    if(!category) {return;}
    this.surveyForm.get('category_id')?.setValue(category.id);
  }

  /**
   * @description Handles the cancellation of the survey creation process.
   * Navigates the user back to the home page without saving any changes.
   * This method is typically called when the user decides not to proceed with creating a new survey.
   * @returns {void}
   */
  onCancel(): void {
    this.router.navigate(['']);
  }

  /**
   * @description This private method is called after a survey has been successfully created.
   * It sets the showOverlay signal to true, which likely triggers a visual overlay in the UI.
   * After a short delay (defined by DIALOG_DELAY), it sets the showDialog signal to true, which likely displays a dialog to inform the user of the successful creation.
   * @returns {void}
   */
  private afterCreateSurvey(): void {
    this.showOverlay.set(true);
    setTimeout(() => {
      this.showDialog.set(true);
    }, this.DIALOG_DELAY);
  }

  /**
   * @description This method is called when the success dialog is closed by the user.
   * It sets the showDialog signal to false, hiding the dialog.
   * After a short delay (defined by OVERLAY_CLOSE_DELAY), it sets the showOverlay signal to false, hiding the overlay.
   * Finally, it calls the callPublishedSurvey method to navigate the user to the newly created survey's view page.
   * @returns {void}
   */
  onSuccessDialogClose(): void {
    this.showDialog.set(false);
    setTimeout(() => {
      this.showOverlay.set(false);
      this.callPublishedSurvey();
    }, this.OVERLAY_CLOSE_DELAY);
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
    this.router.navigate(['/view', this.currentSurveyId]);
  }

}
