import { Injectable, OnInit, signal } from '@angular/core';
import { AuthWeakPasswordError, createClient, RealtimeChannel } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../environments/environment';
import { Category } from '../interfaces/category-interface';
import { Survey } from '../interfaces/survey-interface';
import { SurveyWithCategory } from '../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../interfaces/question-with-answers-interface';
import { SurveyModel } from '../models/survey-model';
import { FormGroup } from '@angular/forms';
import { QuestionModel } from '../models/question-model';
import { AnswerModel } from '../models/answer-model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService implements OnInit {

  private supabaseClient = createClient(ENVIRONMENT.supabaseUrl, ENVIRONMENT.supabaseKey);

  surveyList = signal<SurveyWithCategory[]>([]);

  constructor() {
    this.getCategories().then(c => {
      //console.log(c);
    });

    this.getSurveys().then(s => {
      //console.log(s);
    });

    this.getQuestionsWithAnswersBySurveyId(1).then(qwa => {
      //console.log(qwa);
    });
  }

  ngOnInit(): void {

  }

  async getCategories(): Promise<Category[]> {
    const response = await this.supabaseClient.from('categories').select('*');
    return (response.data ?? []) as Category[];
  }

  async getSurveys(): Promise<Survey[]> {
    const response = await this.supabaseClient.from('surveys').select('*');
    return (response.data ?? []) as Survey[];
  }

  async getSurveyWithCategory(): Promise<void> {
    const response = await this.supabaseClient.from('surveys')
      .select(`*,category:categories(id, name)`);
    this.surveyList.set(response.data ?? [] as SurveyWithCategory[]);
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

  async handleAddSurvey(surveyForm: FormGroup) {
    //1. SurveyModel erstellen und in DB speichern
    const survey = new SurveyModel(surveyForm.value);
    survey.category_id = 1;
    const responseSurveyId = await this.createSurvey(survey);
    //2. wenn die Survey ID > 0 ist Questions erstellen
    if(responseSurveyId === 0){return;}
    await this.handleQuestions(surveyForm.value['questions'], responseSurveyId);
    
  }

  async createSurvey(survey: SurveyModel): Promise<number> {
    const surveyJson = survey.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('surveys').insert([ surveyJson ,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  async handleQuestions(questionsDataRaw: [], surveyId: number){
    for (let questionIndex = 0; questionIndex < questionsDataRaw.length; questionIndex++) {
      const question = new QuestionModel(questionsDataRaw[questionIndex], surveyId);
      question.sort_order = questionIndex;
      const questionIdRespons: number = await this.createQuestion(question);
      if(questionIdRespons === 0) {break;}
      await this.handleAnswers(questionsDataRaw[questionIndex]['answers'], questionIdRespons);
    }
  }

  async createQuestion(question: QuestionModel): Promise<number> {
    const questionJson = question.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('questions').insert([ questionJson ,]).select();
    return response.data?.[0]?.id ?? 0;
  }

  async handleAnswers(answersDataRaw: [], questionId: number) {
    for(let answerIndex = 0; answerIndex < answersDataRaw.length; answerIndex++){
      const answer = new AnswerModel(answersDataRaw[answerIndex], questionId);
      answer.sort_order = answerIndex;
      const answerIdResponse:number = await this.createAnswer(answer);
      if(answerIdResponse === 0) {break;}
    }
  }

  async createAnswer(answer: AnswerModel): Promise<number> {
    const answerJson = answer.getCleanAddSurveyJson();
    const response = await this.supabaseClient
      .from('answers').insert([ answerJson ,]).select();
    return response.data?.[0]?.id ?? 0;
  }

}
