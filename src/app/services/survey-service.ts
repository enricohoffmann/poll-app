import { Injectable, OnInit, signal, computed, inject, OnDestroy } from '@angular/core';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../environments/environment';
import { Category } from '../interfaces/category-interface';
import { Survey } from '../interfaces/survey-interface';
import { SurveyWithCategory } from '../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../interfaces/question-with-answers-interface';
import { SurveyModel } from '../models/survey-model';
import { FormArray, FormGroup } from '@angular/forms';
import { QuestionModel } from '../models/question-model';
import { AnswerModel } from '../models/answer-model';
import { AnswerForm, QuestionForm, VoteFrom } from '../shared/utils/types';
import { Vote } from '../interfaces/vote-interface';
import { VoteModel } from '../models/vote-model';
import { VoterTokenService } from './voter-token-service';

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

  constructor() {
    this.supabaseClient = createClient(ENVIRONMENT.supabaseUrl, ENVIRONMENT.supabaseKey);
    this.subscribeInsertVotes();
  }


  ngOnDestroy(): void {
    if (this.voteInsertChannel) {
      this.supabaseClient.removeChannel(this.voteInsertChannel);
    }
  }

  async startRetrieval(): Promise<void> {

    await Promise.all([
      this.getSurveyHighlights(),
      this.getSurveyWithCategory(),
    ]);

  }

  async getCategories(): Promise<void> {
    const response = await this.supabaseClient.from('categories').select('*');
    this.categoriesList.set(response.data ?? [] as Category[]);
  }

  async getSurveys(): Promise<Survey[]> {
    const response = await this.supabaseClient.from('surveys').select('*');
    return (response.data ?? []) as Survey[];
  }

  private async getSurveyWithCategory(): Promise<void> {
    const response = await this.supabaseClient.from('unfiltered_surveys')
      .select(`*,category:categories(id, name)`);
    this.surveyList.set(response.data ?? [] as SurveyWithCategory[]);
  }


  async getSurveyById(surveyId: number): Promise<SurveyWithCategory> {
    const response = await this.supabaseClient.from('unfiltered_surveys')
      .select(`*,category:categories(id, name)`)
      .eq('id', surveyId)
      .single();
    return (response.data ?? {}) as SurveyWithCategory;
  }

  private async getSurveyHighlights(): Promise<void> {
    const response = await this.supabaseClient.from('expired_surveys')
      .select('*,category:categories(id, name)');
    this.surveyHighlights.set(response.data ?? [] as SurveyWithCategory[]);
  }

  async getQuestionsWithAnswersBySurveyId(surveyId: number): Promise<QuestionWithAnswers[]> {
    const response = await this.supabaseClient.from('questions')
      .select('*, answers(id, text, sort_order)')
      .eq('survey_id', surveyId)
      .order('sort_order', { ascending: true })
      .order('sort_order', { ascending: true, referencedTable: 'answers' });
    if (response.error) { return []; }
    return (response.data ?? []) as QuestionWithAnswers[];
  }

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

  setCurrentQuestionIds(questionIds: number[]): void {
    this.currentQuestionIds = new Set(questionIds);
  }

  clearCurrentQuestionIds(): void {
    this.currentQuestionIds.clear();
  }

  async handleAddSurvey(surveyForm: FormGroup): Promise<number> {
    const survey = new SurveyModel(surveyForm.value);
    const responseSurveyId = await this.createSurvey(survey);
    if (responseSurveyId === 0) { return 0; }
    return await this.handleQuestions(surveyForm.value['questions'], responseSurveyId) == true ? responseSurveyId : 0;
  }

  private async createSurvey(survey: SurveyModel): Promise<number> {
    const surveyJson = survey.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('surveys').insert([surveyJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  private async handleQuestions(questionsDataRaw: [], surveyId: number): Promise<boolean> {
    for (let questionIndex = 0; questionIndex < questionsDataRaw.length; questionIndex++) {
      const question = new QuestionModel(questionsDataRaw[questionIndex], surveyId);
      question.sort_order = questionIndex;
      const questionIdRespons: number = await this.createQuestion(question);
      if (questionIdRespons === 0) { return false; }
      const answerResult: boolean =
        await this.handleAnswers(questionsDataRaw[questionIndex]['answers'], questionIdRespons);
      if (!answerResult) { return false; }
    }
    return true;
  }

  private async createQuestion(question: QuestionModel): Promise<number> {
    const questionJson = question.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('questions').insert([questionJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  private async handleAnswers(answersDataRaw: [], questionId: number): Promise<boolean> {
    for (let answerIndex = 0; answerIndex < answersDataRaw.length; answerIndex++) {
      const answer = new AnswerModel(answersDataRaw[answerIndex], questionId);
      answer.sort_order = answerIndex;
      const answerIdResponse: number = await this.createAnswer(answer);
      if (answerIdResponse === 0) { return false; }
    }
    return true;
  }

  private async createAnswer(answer: AnswerModel): Promise<number> {
    const answerJson = answer.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('answers').insert([answerJson,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  getCategoryByIndex(categoryIndex: number): (Category | null) {
    const category = this.categoriesList()[categoryIndex];
    return category;
  }

  async handleAddVotes(voteForm: FormGroup<VoteFrom>): Promise<boolean> {
    const votes: VoteModel[] = [];
    const voterToken = this.voterTokenService.getTokenForReview();
    voteForm.controls.questions.controls.forEach((question) => {
      this.collectSelectedAnswers(question, votes, voterToken);
    });

    for (const vote of votes) {
      const voteResult = await this.createVote(vote);
      if (voteResult == 0) { return false; }
    }

    return true;
  }

  private collectSelectedAnswers(question: FormGroup<QuestionForm>, votes: VoteModel[], voterToken: string): void {
    const questinId = question.controls.id.value;
    question.controls.answers.controls.forEach((answer) => {
      if (!answer.controls.select.value) { return; }
      votes.push(new VoteModel(answer.controls.answerId.value, questinId, voterToken));
    });
  }

  private async createVote(vote: VoteModel): Promise<number> {
    const voteJson = vote.getCleanAddVoteJson();
    const voteResponse = await this.supabaseClient
      .from('votes').insert([voteJson,]).select();
    return voteResponse.data?.[0]?.id ?? 0;
  }

  private subscribeInsertVotes(): void {
    this.voteInsertChannel = this.supabaseClient.channel('custom-all-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' },
        payload => this.handleInsertedVote(payload.new)
      ).subscribe();
  }

  private handleInsertedVote(data: Record<string, unknown>): void {

    const questinId = Number(data['question_id']);
    if (!this.currentQuestionIds.has(questinId)) { return; }

    const vote: Vote = {
      id: Number(data['id']),
      question_id: Number(data['question_id']),
      answer_id: Number(data['answer_id']),
      voter_token: String(data['voter_token'])
    };

    this.voteList.update(votes => [...votes, vote]);

  }

}
