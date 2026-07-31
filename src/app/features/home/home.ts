import { Component, inject, OnInit, signal, effect, computed, ViewChild, ElementRef } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Router } from '@angular/router';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { DropDownMenu } from '../../shared/components/drop-down-menu/drop-down-menu';
import { Category } from '../../interfaces/category-interface';
import { HeroIllustration } from '../../shared/components/hero-illustration/hero-illustration';

/**
 * @description This component represents the home page of the application. It displays a list of surveys, allowing users to filter and sort them based on their status (active or past) and category. 
 * The component also provides navigation to create new surveys and view existing ones.
 */
@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard, DropDownMenu, HeroIllustration],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  @ViewChild('surveyList')
  private surveyList!: ElementRef;
  surveyService = inject(SurveyService);
  private readonly router = inject(Router);
  surveyStatus = signal<'active' | 'past'>('active');
  currentCategory = signal<Category | null>(null);
  isMenuOpen = signal(false);

  /**
   * @description A computed signal that filters the list of surveys based on the current filter settings (active or past surveys). 
   * It returns a list of surveys that are visible according to the user's selection.
   * @returns {SurveyWithCategory[]} A filtered list of surveys that match the current visibility criteria. 
   */
  private surveyFilteredList = computed(() => {
    return this.surveyService.surveyList().filter(survey => this.isSurveyVisible(survey));
  });


  visibleSurveys = computed(() => {
    const category = this.currentCategory();
    const surveys = this.surveyFilteredList();
    if (!category) { return surveys; }
    return surveys.filter(survey => survey.category_id === category.id);
  });

  availableCategories = computed(() => {
    const surveys = this.surveyFilteredList();
    const categories = surveys.map(survey => survey.category);

    return categories.filter(
      (category, index, array) =>
        array.findIndex(item => item.id === category.id) === index
    );
  });

  constructor() { }

  /**
   * @description The ngOnInit lifecycle hook is called after the component is initialized. It triggers the retrieval of survey data from the SurveyService, ensuring that the component has the necessary data to display when it is rendered.
   * This method is asynchronous and waits for the data retrieval to complete before proceeding.
   * It is essential for populating the survey list and categories when the home page is loaded.
   * @returns {Promise<void>} A promise that resolves when the survey data retrieval is complete.
   */
  async ngOnInit(): Promise<void> {
    await this.surveyService.startRetrieval();
  }

  /**
   * @description Navigates the user to the survey creation page. This method is triggered when the user clicks the "New Survey" button, allowing them to create a new survey.
   * It uses the Angular Router to change the route to the 'create' path, which corresponds to the survey creation component.
   * This method does not return any value and is primarily used for navigation purposes.
   * @returns {void}
   */
  onNewSurvey(): void {
    this.router.navigate(['create']);
  }


  onFilterActiveSurveys(): void {
    this.surveyStatus.set('active');
    this.resetCategoryIfUnavailable();
    this.scrollToSurveyList();
  }


  onFilterPastSurveys(): void {
    this.surveyStatus.set('past');
    this.resetCategoryIfUnavailable();
    this.scrollToSurveyList();
  }

  private scrollToSurveyList(): void {
    setTimeout(() => {
      this.surveyList.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /**
   * @description Determines whether a given survey should be visible based on the current filter settings (active or past surveys).
   * @param survey The survey to check for visibility.
   * @returns {boolean} True if the survey is visible according to the current filter settings, false otherwise.
   */
  private isSurveyVisible(survey: SurveyWithCategory): boolean {
    if (this.surveyStatus() === 'active') { return survey.difference_in_days >= 0; }
    if (this.surveyStatus() === 'past') { return survey.difference_in_days < 0; }
    return false;
  }


  onFilterByCategory(category: Category | null): void {
    this.currentCategory.set(category);
    this.scrollToSurveyList();
  }


  showEmptyState(): string {
    const category = this.currentCategory();
    if (category) { return `No surveys found in ${category.name}.`; }
    if (this.surveyStatus() === 'active') { return 'No active surveys right now.'; }
    if (this.surveyStatus() === 'past') { return 'No past surveys right now.'; }
    return 'No surveys right now.';
  }

  /**
   * @description Navigates the user to the survey view page for the specified survey ID.
   * @param surveyId The ID of the survey to view.
   */
  onSurveyView(surveyId: number): void {
    this.router.navigate(['/view', surveyId]);
  }

  private resetCategoryIfUnavailable(): void {
    const currentCategory = this.currentCategory();

    if (!currentCategory) { return; }

    const isAvailable = this.availableCategories().some(
      category => category.id === currentCategory.id
    );

    if (!isAvailable) {
      this.currentCategory.set(null);
    }
  }

}
