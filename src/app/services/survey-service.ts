import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../environments/environment';
import { Category } from '../interfaces/category-interface';
import { Survey } from '../interfaces/survey-interface';
import { SurveyWithCategory } from '../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../interfaces/question-with-answers-interface';
import { SurveyModel } from '../models/survey-model';
import { QuestionModel } from '../models/question-model';
import { AnswerModel } from '../models/answer-model';
import { AnswerForm, QuestionForm, SurveyForm, VoteFrom } from '../shared/utils/types';
import { Vote } from '../interfaces/vote-interface';
import { VoteModel } from '../models/vote-model';
import { VoterTokenService } from './voter-token-service';
import { FormArray, FormGroup } from '@angular/forms';

/**
 * @description Service to manage surveys, questions, answers, and votes using Supabase as the backend.
 * It provides methods to retrieve surveys, categories, questions with answers, and handle the addition of surveys and votes.
 * The service also subscribes to real-time updates for votes using Supabase's Realtime feature.
 * @implements {OnDestroy} to clean up the Realtime channel when the service is destroyed.
 */
@Injectable({
  providedIn: 'root',
})
export class SurveyService implements OnDestroy {

  private supabaseClient: SupabaseClient;
  private voteInsertChannel: RealtimeChannel | undefined;
  private voterTokenService = inject(VoterTokenService);
  private currentQuestionIds = new Set<number>();

  surveyList = signal<SurveyWithCategory[]>([]);
  surveyHighlights = signal<SurveyWithCategory[]>([]);
  categoriesList = signal<Category[]>([]);
  voteList = signal<Vote[]>([]);

  /**
   * Initializes the SurveyService by creating a Supabase client and subscribing to real-time vote insert events.
   * The Supabase client is created using the URL and key from the environment configuration.
   * The service subscribes to the 'votes' table for INSERT events to handle real-time updates.
   * @constructor
   */
  constructor() {
    this.supabaseClient = createClient(ENVIRONMENT.supabaseUrl, ENVIRONMENT.supabaseKey);
    this.subscribeInsertVotes();
  }

  /**
   * Cleans up the Realtime channel subscription when the service is destroyed.
   * This method is called automatically by Angular when the service is destroyed.
   * It removes the Realtime channel for vote insert events to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.voteInsertChannel) {
      this.supabaseClient.removeChannel(this.voteInsertChannel);
    }
  }

  /**
   * Starts the retrieval of survey highlights and surveys with categories.
   * This method retrieves survey highlights and surveys with categories in parallel using Promise.all.
   * It updates the surveyHighlights and surveyList signals with the retrieved data.
   * @returns {Promise<void>} A promise that resolves when both retrievals are complete.
   * @async
   */
  async startRetrieval(): Promise<void> {
    await Promise.all([
      this.getSurveyHighlights(),
      this.getSurveyWithCategory(),
      this.getCategories()
    ]);

  }

  /**
   * @description Checks if the current voter has already filled out the survey by looking for their voter token in the voteList. 
   * @param currentVoter The voter token of the current user.
   * @returns {boolean} True if the voter has already filled out the survey, false otherwise.
   */
  checkHasAlreadyFilled(currentVoter: string): boolean {
    if(this.voteList().length == 0) {return false;}
    return !!this.voteList().find(vote => vote.voter_token === currentVoter);
  }

  /**
   * Retrieves the list of categories from the Supabase database and updates the categoriesList signal.
   * This method queries the 'categories' table and sets the categoriesList signal with the retrieved data.
   * If no data is found, it sets the categoriesList signal to an empty array.
   * @returns {Promise<void>} A promise that resolves when the retrieval is complete.
   * @async
   */
  async getCategories(): Promise<void> {
    const response = await this.supabaseClient.from('categories').select('*');
    this.categoriesList.set(response.data ?? [] as Category[]);
  }

  /**
   * Retrieves the list of surveys from the Supabase database.
   * @returns {Promise<Survey[]>} A promise that resolves to an array of surveys.
   */
  async getSurveys(): Promise<Survey[]> {
    const response = await this.supabaseClient.from('surveys').select('*');
    return (response.data ?? []) as Survey[];
  }

  /**
   * Retrieves the list of surveys along with their associated categories from the Supabase database and updates the surveyList signal.
   * This method queries the 'unfiltered_surveys' table and joins it with the 'categories' table to get the category information.
   * It sets the surveyList signal with the retrieved data. If no data is found, it sets the surveyList signal to an empty array.
   * @returns {Promise<void>} A promise that resolves when the retrieval is complete.
   * @async 
   */
  private async getSurveyWithCategory(): Promise<void> {
    const response = await this.supabaseClient.from('unfiltered_surveys')
      .select(`*,category:categories(id, name)`);
    this.surveyList.set(response.data ?? [] as SurveyWithCategory[]);
  }

  /**
   * Retrieves a survey along with its associated category by survey ID from the Supabase database.
   * @param surveyId The ID of the survey to retrieve.
   * @returns {Promise<SurveyWithCategory>} A promise that resolves to the survey with its category.
   */
  async getSurveyById(surveyId: number): Promise<SurveyWithCategory> {
    const response = await this.supabaseClient.from('unfiltered_surveys')
      .select(`*,category:categories(id, name)`)
      .eq('id', surveyId)
      .single();
    return (response.data ?? {}) as SurveyWithCategory;
  }

  /**
   * Retrieves the list of survey highlights along with their associated categories from the Supabase database and updates the surveyHighlights signal.
   * This method queries the 'expired_surveys' table and joins it with the 'categories' table to get the category information.
   * It sets the surveyHighlights signal with the retrieved data. If no data is found, it sets the surveyHighlights signal to an empty array.
   * @returns {Promise<void>} A promise that resolves when the retrieval is complete.
   * @async
   */
  private async getSurveyHighlights(): Promise<void> {
    const response = await this.supabaseClient.from('expired_surveys')
      .select('*,category:categories(id, name)');
    this.surveyHighlights.set(response.data ?? [] as SurveyWithCategory[]);
  }

  /**
   * Retrieves the list of questions along with their associated answers for a given survey ID from the Supabase database.
   * @param surveyId The ID of the survey to retrieve questions and answers for.
   * @returns {Promise<QuestionWithAnswers[]>} A promise that resolves to an array of questions with their answers.
   */
  async getQuestionsWithAnswersBySurveyId(surveyId: number): Promise<QuestionWithAnswers[]> {
    const response = await this.supabaseClient.from('questions')
      .select('*, answers(id, text, sort_order)')
      .eq('survey_id', surveyId)
      .order('sort_order', { ascending: true })
      .order('sort_order', { ascending: true, referencedTable: 'answers' });
    if (response.error) { return []; }
    return (response.data ?? []) as QuestionWithAnswers[];
  }

  /**
   * Loads the votes for the current set of question IDs from the Supabase database and updates the voteList signal.
   * @returns {Promise<void>} A promise that resolves when the votes are loaded.
   */
  async loadVotesByQuestionIds(): Promise<void> {
    if (this.currentQuestionIds.size === 0) { return; }
    const response = await this.supabaseClient
      .from('votes')
      .select('*')
      .in('question_id', Array.from(this.currentQuestionIds));
    if (response.error) { return; }
    const votes = (response.data ?? []) as Vote[];
    this.voteList.set(votes)
  }

  /**
   * @description Sets the current set of question IDs.
   * @param questionIds An array of question IDs to set as the current question IDs.
   */
  setCurrentQuestionIds(questionIds: number[]): void {
    this.currentQuestionIds = new Set(questionIds);
  }

  /**
   * @description Clears the current set of question IDs.
   * @returns {void}
   */
  clearCurrentQuestionIds(): void {
    this.currentQuestionIds.clear();
  }

  /**
   * Handles the addition of a new survey along with its questions and answers.
   * @param surveyForm The form group containing the survey data.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created survey, or 0 if the creation failed.
   */
  async handleAddSurvey(surveyForm: FormGroup<SurveyForm>): Promise<number> {
    const survey = new SurveyModel(surveyForm.value);

    const responseSurveyId = await this.createSurvey(survey);
    console.log(survey, responseSurveyId);
    
    if (responseSurveyId === 0) { return 0; }
    return await this.handleQuestions(surveyForm.controls.questions, responseSurveyId) == true ? responseSurveyId : 0; 
  }

  /**
   * Creates a new survey in the Supabase database.
   * @param survey The survey model containing the survey data.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created survey, or 0 if the creation failed.
   */
  private async createSurvey(survey: SurveyModel): Promise<number> {
    const surveyJson = survey.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('surveys').insert([surveyJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  /**
   * Handles the addition of questions for a given survey.
   * @param questionsDataRaw An array of raw question data.
   * @param surveyId The ID of the survey to add questions to.
   * @returns {Promise<boolean>} A promise that resolves to true if all questions were added successfully, false otherwise.
   */
  private async handleQuestions(questionsDataRaw: FormArray<FormGroup<QuestionForm>>, surveyId: number): Promise<boolean> {
    for (let questionIndex = 0; questionIndex < questionsDataRaw.length; questionIndex++) {
      const question = new QuestionModel(questionsDataRaw.at(questionIndex).value, surveyId);
      question.sort_order = questionIndex;
      const questionIdRespons: number = await this.createQuestion(question);
      if (questionIdRespons === 0) { return false; }
      const answerResult: boolean =
        await this.handleAnswers(questionsDataRaw.at(questionIndex).controls.answers, questionIdRespons);
      if (!answerResult) { return false; }
    }
    return true;
  }

  /**
   * Creates a new question in the Supabase database.
   * @param question The question model containing the question data.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created question, or 0 if the creation failed.
   */
  private async createQuestion(question: QuestionModel): Promise<number> {
    const questionJson = question.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('questions').insert([questionJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  /**
   * Handles the addition of answers for a given question.
   * @param answersDataRaw An array of raw answer data.
   * @param questionId The ID of the question to add answers to.
   * @returns {Promise<boolean>} A promise that resolves to true if all answers were added successfully, false otherwise.
   */
  private async handleAnswers(answersDataRaw: FormArray<FormGroup<AnswerForm>>, questionId: number): Promise<boolean> {
    for (let answerIndex = 0; answerIndex < answersDataRaw.length; answerIndex++) {
      const answer = new AnswerModel(answersDataRaw.at(answerIndex).value, questionId);
      answer.sort_order = answerIndex;
      const answerIdResponse: number = await this.createAnswer(answer);
      if (answerIdResponse === 0) { return false; }
    }
    return true;
  }

  /**
   * Creates a new answer in the Supabase database.
   * @param answer The answer model containing the answer data.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created answer, or 0 if the creation failed.
   */
  private async createAnswer(answer: AnswerModel): Promise<number> {
    const answerJson = answer.getCleanAddSurveyJson();
    console.log('Creating answer:', answerJson);
    const response = await this.supabaseClient
      .from('answers').insert([answerJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  /**
   * Retrieves a category by its index in the categories list.
   * @param categoryIndex The index of the category to retrieve.
   * @returns {(Category | null)} The category at the specified index, or null if not found.
   */
  getCategoryByIndex(categoryId: number): (Category | null) {
    const category = this.categoriesList().find(c => c.id === categoryId);
    return category ?? null;
  }

  /**
   * Handles the addition of votes based on the provided vote form.
   * @param voteForm The form group containing the vote data.
   * @returns {Promise<boolean>} A promise that resolves to true if all votes were added successfully, false otherwise.
   */
  async handleAddVotes(voteForm: FormGroup<VoteFrom>): Promise<boolean> {
    const votes: VoteModel[] = [];
    const voterToken = this.voterTokenService.getToken();
    voteForm.controls.questions.controls.forEach((question) => {
      this.collectSelectedAnswers(question, votes, voterToken);
    });

    for (const vote of votes) {
      const voteResult = await this.createVote(vote);
      if (voteResult == 0) { return false; }
    }

    return true;
  }

  /**
   * Collects the selected answers for a given question and adds them to the votes array.
   * @param question The form group containing the question data.
   * @param votes The array of votes to add the selected answers to.
   * @param voterToken The token of the voter.
   * @returns {void}
   */
  private collectSelectedAnswers(question: FormGroup<QuestionForm>, votes: VoteModel[], voterToken: string): void {
    const questionId = question.controls.id.value;
    question.controls.answers.controls.forEach((answer) => {
      if (!answer.controls.select.value) { return; }
      votes.push(new VoteModel(answer.controls.id.value, questionId, voterToken));
    });
  }

  /**
   * Creates a new vote in the Supabase database.
   * @param vote The vote model containing the vote data.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created vote, or 0 if the creation failed.
   */
  private async createVote(vote: VoteModel): Promise<number> {
    const voteJson = vote.getCleanAddVoteJson();
    const voteResponse = await this.supabaseClient
      .from('votes').insert([voteJson,]).select();
    return voteResponse.data?.[0]?.id ?? 0;
  }

  /**
   * @description Subscribes to real-time INSERT events on the 'votes' table in the Supabase database.
   * When a new vote is inserted, the handleInsertedVote method is called to process the new vote data.
   * This allows the application to receive real-time updates for votes without needing to refresh the page.
   * @returns {void}
   */
  private subscribeInsertVotes(): void {
    this.voteInsertChannel = this.supabaseClient.channel('custom-all-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' },
        payload => this.handleInsertedVote(payload.new)
      ).subscribe();
  }

  /**
   * @description Handles the insertion of a new vote received from the real-time subscription. 
   * Updates the voteList signal if the question ID of the new vote is in the currentQuestionIds set.
   * @param data The data of the newly inserted vote.
   * @returns {void}
   */
  private handleInsertedVote(data: Record<string, unknown>): void {
    const questionId = Number(data['question_id']);
    if (!this.currentQuestionIds.has(questionId)) { return; }

    const vote: Vote = {
      id: Number(data['id']),
      question_id: Number(data['question_id']),
      answer_id: Number(data['answer_id']),
      voter_token: String(data['voter_token'])
    };

    this.voteList.update(votes => [...votes, vote]);
  }

}
