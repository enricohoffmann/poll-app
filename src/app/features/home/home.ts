import { Component, inject, OnInit, signal, effect, computed, input } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Router } from '@angular/router';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { DropDownMenu } from '../../shared/components/drop-down-menu/drop-down-menu';
import { Category } from '../../interfaces/category-interface';
import { HeroIllustration } from '../../shared/components/hero-illustration/hero-illustration';

@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard, DropDownMenu, HeroIllustration],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  surveyService = inject(SurveyService);
  private readonly router = inject(Router);
  showActiveSurveys = signal(true);
  showPastSurveys = signal(false);
  currentCategory = signal<Category | null>(null);

  private surveyFilteredList = computed(() => {
    return this.surveyService.surveyList().filter(survey => this.isSurveyVisible(survey));
  });

  surveySortedList = computed(() => {
    const category = this.currentCategory();
    const surveys = [...this.surveyFilteredList()];
    if (!category) { return surveys; }
    return this.sortingSurveyList(category, surveys);
  });

  /**TODO: Die Nullwerte vom Ablaufdatum noch einbauen, in der DB schon drin. */

  constructor() {
    effect(() => {
      if (!this.showActiveSurveys() && !this.showPastSurveys()) {
        this.showActiveSurveys.set(true);
      }
    });
  }


  async ngOnInit(): Promise<void> {
    await this.surveyService.startRetrieval();
  }

  onNewSurvey(): void {
    this.router.navigate(['create']);
  }

  onFilterActiveSurveys(): void {
    this.showActiveSurveys.set(!this.showActiveSurveys());

  }

  onFilterPastSurveys(): void {
    this.showPastSurveys.set(!this.showPastSurveys());
  }

  private isSurveyVisible(survey: SurveyWithCategory): boolean {
    if (this.showActiveSurveys() && this.showPastSurveys()) { return true; }
    if (this.showActiveSurveys()) { return survey.difference_in_days >= 0; }
    if (this.showPastSurveys()) { return survey.difference_in_days < 0; }
    return false;
  }

  onSortByCategory(category: Category): void {
    this.currentCategory.set(category);
  }

  private sortingSurveyList(category: Category, unsortedSurveyList: SurveyWithCategory[]): SurveyWithCategory[] {
    return unsortedSurveyList.sort((a, b) => {
      const aMatches = a.category_id === category.id;
      const bMatches = b.category_id === category.id;

      if (aMatches && !bMatches) { return -1; }
      if (!aMatches && bMatches) { return 1; }
      return 0;
    });
  }


  showEmptyState(): string {
    if(this.showActiveSurveys() && !this.showPastSurveys()) {return 'No active surveys right now.';}
    if(!this.showActiveSurveys() && this.showPastSurveys()) {return 'No past surveys right now.';}
    return 'No surveys right now.';
  }

  onSurveyView(surveyId: number): void {
    this.router.navigate(['/view', surveyId]);
  }

}
