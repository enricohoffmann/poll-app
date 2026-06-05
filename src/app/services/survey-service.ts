import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../environments/environment';
import { Category } from '../interfaces/category-interface';
import { Survey } from '../interfaces/survey-interface';
import { SurveyWithCategory } from '../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../interfaces/question-with-answers-interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  private supabaseClient = createClient(ENVIRONMENT.supabaseUrl, ENVIRONMENT.supabaseKey);

  surveyList = signal<SurveyWithCategory[]>([]);

  constructor(){
    this.getCategories().then(c => {
      //console.log(c);
    });

    this.getSurveys().then(s => {
      //console.log(s);
    });

    this.getSurveyWithCategory().then(swc => {
      this.surveyList.set(swc);
    });

    this.getQuestionsWithAnswersBySurveyId(1).then(qwa => {
      //console.log(qwa);
    });
  }

  async getCategories():Promise<Category[]> {
    const response = await this.supabaseClient.from('categories').select('*');
    return (response.data ?? []) as Category[];
  }

  async getSurveys():Promise<Survey[]> {
    const response = await this.supabaseClient.from('surveys').select('*');
    return (response.data ?? []) as Survey[];
  }

  async getSurveyWithCategory(): Promise<SurveyWithCategory[]>{
    const response = await this.supabaseClient.from('surveys')
      .select(`*,category:categories(id, name)`);
    return (response.data ?? []) as SurveyWithCategory[];    
  }

  async getQuestionsWithAnswersBySurveyId(surveyId: number): Promise<QuestionWithAnswers[]>{
    const response = await this.supabaseClient.from('questions')
      .select('*, answers(id, text, sort_order)')
      .eq('survey_id', surveyId)
      .order('sort_order', {ascending: true})
      .order('sort_order', {ascending: true, referencedTable: 'answers'});
    if(response.error){return [];}
    return (response.data ?? []) as QuestionWithAnswers[];
      
  }
}
