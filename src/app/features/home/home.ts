import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
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
  surveyService = inject(SurveyService);
  private readonly router = inject(Router);
  showActiveSurveys = signal(true);
  showPastSurveys = signal(false);
  currentCategory = signal<Category | null>(null);

  /**
   * @description A computed signal that filters the list of surveys based on the current filter settings (active or past surveys). 
   * It returns a list of surveys that are visible according to the user's selection.
   * @returns {SurveyWithCategory[]} A filtered list of surveys that match the current visibility criteria. 
   */
  private surveyFilteredList = computed(() => {
    return this.surveyService.surveyList().filter(survey => this.isSurveyVisible(survey));
  });

  /**
   * @description A computed signal that sorts the filtered list of surveys based on the selected category.
   * If no category is selected, it returns the filtered list as is. If a category is selected, it sorts the surveys to prioritize those that match the selected category.
   * @returns {SurveyWithCategory[]} A sorted list of surveys based on the current category selection.
   */
  surveySortedList = computed(() => {
    const category = this.currentCategory();
    const surveys = [...this.surveyFilteredList()];
    if (!category) { return surveys; }
    return this.sortingSurveyList(category, surveys);
  });

  /**
   * @description The constructor initializes the Home component and sets up an effect to ensure that at least one of the survey filters (active or past) is always selected.
   * If both filters are deselected, it automatically re-selects the active surveys filter to maintain a valid state.
   * This ensures that the user always has a viewable list of surveys.
   * The effect runs whenever the values of showActiveSurveys or showPastSurveys change.
   */
  constructor() {
    effect(() => {
      if (!this.showActiveSurveys() && !this.showPastSurveys()) {
        this.showActiveSurveys.set(true);
      }
    });
  }

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

  /**
   * @description Toggles the visibility of active surveys. When called, it switches the state of the showActiveSurveys signal between true and false, allowing users to filter the survey list to show or hide active surveys.
   * This method is typically bound to a user interface element, such as a button or checkbox, that allows users to control the visibility of active surveys.
   * @returns {void}
   */
  onFilterActiveSurveys(): void {
    this.showActiveSurveys.set(!this.showActiveSurveys());
  }

  /**
   * @description Toggles the visibility of past surveys. When called, it switches the state of the showPastSurveys signal between true and false, allowing users to filter the survey list to show or hide past surveys.
   * This method is typically bound to a user interface element, such as a button or checkbox, that allows users to control the visibility of past surveys.
   * @returns {void}
   */
  onFilterPastSurveys(): void {
    this.showPastSurveys.set(!this.showPastSurveys());
  }

  /**
   * @description Determines whether a given survey should be visible based on the current filter settings (active or past surveys).
   * @param survey The survey to check for visibility.
   * @returns {boolean} True if the survey is visible according to the current filter settings, false otherwise.
   */
  private isSurveyVisible(survey: SurveyWithCategory): boolean {
    if (this.showActiveSurveys() && this.showPastSurveys()) { return true; }
    if (this.showActiveSurveys()) { return survey.difference_in_days >= 0; }
    if (this.showPastSurveys()) { return survey.difference_in_days < 0; }
    return false;
  }

  /**
   * @description Sets the current category for sorting surveys. When called, it updates the currentCategory signal with the selected category, which triggers the sorting of the survey list based on this category.
   * @param category The category to sort the surveys by. 
   * @returns {void}
   */
  onSortByCategory(category: Category): void {
    this.currentCategory.set(category);
  }

  /**
   * @description Sorts a list of surveys based on the specified category. Surveys that match the category are prioritized.
   * @param category The category to sort the surveys by.
   * @param unsortedSurveyList The list of surveys to be sorted.
   * @returns {SurveyWithCategory[]} A sorted list of surveys with those matching the category appearing first.
   */
  private sortingSurveyList(category: Category, unsortedSurveyList: SurveyWithCategory[]): SurveyWithCategory[] {
    return unsortedSurveyList.sort((a, b) => {
      const aMatches = a.category_id === category.id;
      const bMatches = b.category_id === category.id;

      if (aMatches && !bMatches) { return -1; }
      if (!aMatches && bMatches) { return 1; }
      return 0;
    });
  }

  /**
   * @description Provides a message to display when there are no surveys to show, based on the current filter settings.
   * @returns {string} A message indicating the empty state for the survey list.
   */
  showEmptyState(): string {
    if(this.showActiveSurveys() && !this.showPastSurveys()) {return 'No active surveys right now.';}
    if(!this.showActiveSurveys() && this.showPastSurveys()) {return 'No past surveys right now.';}
    return 'No surveys right now.';
  }

  /**
   * @description Navigates the user to the survey view page for the specified survey ID.
   * @param surveyId The ID of the survey to view.
   */
  onSurveyView(surveyId: number): void {
    this.router.navigate(['/view', surveyId]);
  }

}
