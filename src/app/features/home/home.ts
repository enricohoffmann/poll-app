import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, output } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Router } from '@angular/router';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { DropDownMenu } from '../../shared/components/drop-down-menu/drop-down-menu';
import { Category } from '../../interfaces/category-interface';
import { HeroIllustration } from '../../shared/components/hero-illustration/hero-illustration';
import { CreateSurveyModal } from '../../shared/components/create-survey-modal/create-survey-modal';
import { SurveyCreate } from '../survey-create/survey-create';

/**
 * @description The Home component serves as the main landing page for the poll application. It displays a list of surveys, allows users to filter surveys by status (active or past) and category, and provides navigation to create new surveys or view existing ones. The component interacts with the SurveyService to retrieve survey data and manage the state of the survey list and filters.
 * It also handles user interactions such as selecting a category, filtering surveys, and navigating to survey details or creation pages.
 */
@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard, DropDownMenu, HeroIllustration, CreateSurveyModal, SurveyCreate],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  @ViewChild('surveyList')
  private surveyList!: ElementRef;
  readonly surveyService = inject(SurveyService);
  private readonly router = inject(Router);
  surveyStatus = signal<'active' | 'past'>('active');
  currentCategory = signal<Category | null>(null);
  isMenuOpen = signal(false);
  showCreateSurvey = signal(false);
  

  /**
   * @description A computed signal that filters the list of surveys based on the current filter settings (active or past surveys). 
   * It returns a list of surveys that are visible according to the user's selection.
   * @returns {SurveyWithCategory[]} A filtered list of surveys that match the current visibility criteria. 
   */
  private surveyFilteredList = computed(() => {
    return this.surveyService.surveyList().filter(survey => this.isSurveyVisible(survey));
  });

  /**
   * @description A computed signal that determines the list of surveys to be displayed based on the selected category.
   * If no category is selected, it returns the full list of filtered surveys. If a category is selected, it filters the surveys to only include those that belong to the selected category.
   * @returns {SurveyWithCategory[]} A list of surveys that match the current category selection.
   * @remarks This computed signal reacts to changes in both the current category and the filtered survey list, ensuring that the displayed surveys are always up-to-date with the user's selections.
   */
  visibleSurveys = computed(() => {
    const category = this.currentCategory();
    const surveys = this.surveyFilteredList();
    if (!category) { return surveys; }
    return surveys.filter(survey => survey.category_id === category.id);
  });

  /**
   * @description A computed signal that generates a list of available categories based on the currently filtered surveys.
   * It extracts the categories from the filtered surveys and ensures that each category is unique in the list.
   * @returns {Category[]} A list of unique categories derived from the currently filtered surveys.
   * @remarks This computed signal reacts to changes in the filtered survey list, ensuring that the available categories are always reflective of the surveys currently being displayed.
   */
  availableCategories = computed(() => {
    const surveys = this.surveyFilteredList();
    const categories = surveys.map(survey => survey.category);

    return categories.filter(
      (category, index, array) =>
        array.findIndex(item => item.id === category.id) === index
    );
  });

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
   * @description Filters the list of surveys to show only active surveys. It sets the surveyStatus signal to 'active', resets the current category if it is no longer available, and scrolls the view to the survey list.
   * This method is typically called when the user selects the option to view active surveys, ensuring that only relevant surveys are displayed.
   * @returns {void}
   */
  onFilterActiveSurveys(): void {
    this.surveyStatus.set('active');
    this.resetCategoryIfUnavailable();
    this.scrollToSurveyList();
  }


  /**
   * @description Filters the list of surveys to show only past surveys. It sets the surveyStatus signal to 'past', resets the current category if it is no longer available, and scrolls the view to the survey list.
   * This method is typically called when the user selects the option to view past surveys, ensuring that only relevant surveys are displayed.
   * @returns {void}
   */
  onFilterPastSurveys(): void {
    this.surveyStatus.set('past');
    this.resetCategoryIfUnavailable();
    this.scrollToSurveyList();
  }

  /**
   * @description Scrolls the view to the survey list element. This method is called after filtering surveys or changing categories to ensure that the user is presented with the relevant survey list.
   * It uses the nativeElement.scrollIntoView method to smoothly scroll to the survey list, enhancing the user experience by providing visual feedback on the change in content.
   * @returns {void}
   * @remarks This method is called with a setTimeout to ensure that the DOM has updated before attempting to scroll, preventing potential issues with scrolling to an element that may not yet be rendered.
   */
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

  /**
   * @description Handles the selection of a category for filtering surveys. It updates the currentCategory signal with the selected category and scrolls the view to the survey list to display the filtered results.
   * This method is typically called when a user selects a category from the drop-down menu, allowing them to view surveys that belong to that specific category.
   * @returns {void}
   * @param category The category selected by the user for filtering surveys.
   */
  onFilterByCategory(category: Category | null): void {
    this.currentCategory.set(category);
    this.scrollToSurveyList();
  }

  /**
   * @description Generates a message to display when there are no surveys available based on the current filter settings and category selection. It provides user-friendly feedback indicating the reason for the empty state.
   * The message varies depending on whether a category is selected and the current survey status (active or past).
   * @returns {string} The message to display for the empty state.
   */
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

  /**
   * @description Resets the current category selection if it is no longer available in the list of available categories. 
   * This method checks if the currently selected category exists in the list of available categories derived from the filtered surveys. 
   * If it does not exist, it resets the currentCategory signal to null, ensuring that the user is not left with an invalid category selection.
   * @returns {void}
   */
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

  openCreateSurvey(): void {
    this.showCreateSurvey.set(true);
  }

  closeCreateSurvey(): void {
    this.showCreateSurvey.set(false);
  }

}
