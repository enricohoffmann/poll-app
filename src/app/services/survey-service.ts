import { Injectable } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { ENVIRONMENT } from '../../environments/environment';
import { Category } from '../interfaces/category-interface';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  private supabaseClient = createClient(ENVIRONMENT.supabaseUrl, ENVIRONMENT.supabaseKey);

  constructor(){
    this.getCategories().then(c => {
      console.log(c);
    });
  }

  async getCategories():Promise<Category[]> {
    const response = await this.supabaseClient.from('categories').select('*');
    return (response.data ?? []) as Category[];
  }

}
