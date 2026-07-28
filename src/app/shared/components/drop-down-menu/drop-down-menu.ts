import { Component, inject, signal, output, OnInit, input, computed } from '@angular/core';
import { SurveyService } from '../../../services/survey-service';
import { Category } from '../../../interfaces/category-interface';

/**
 * @description This component is responsible for rendering a drop-down menu that allows users to select a category from a list of categories fetched from the SurveyService. 
 * It manages the state of the menu (open/closed) and emits the selected category when a user makes a selection.
 * @implements OnInit
 */
@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrls: ['./drop-down-menu.scss'],
})
export class DropDownMenu implements OnInit {
  surveyService = inject(SurveyService);
  isMenuOpen = input.required<boolean>();
  sendCategorySelection = output<Category>();
  isCategorySelected = signal(false);
  isOpenChange = output<boolean>();

  /**
   * @description Lifecycle hook that is called after the component's view has been fully initialized. It triggers the retrieval of categories from the SurveyService.
   * @returns void
   * @memberof DropDownMenu
   */
  ngOnInit(): void {
    this.surveyService.getCategories();
  }

  /**
   * @description Toggles the state of the drop-down menu between open and closed when the button is clicked.
   * @returns void
   * @memberof DropDownMenu
   */
  onButtonClick(): void {
    this.isOpenChange.emit(!this.isMenuOpen());
  }

   /**
   * @description Handles the event when a category is clicked in the drop-down menu. It closes the menu, retrieves the selected category from the SurveyService, and emits the selected category to the parent component.
   * @returns void
   * @memberof DropDownMenu
   * @param categoryIndex The index of the selected category in the categories list.
   * @emits sendCategorySelection Emits the selected category to the parent component.
   * @emits isOpenChange Emits the new state of the drop-down menu (closed) to the parent component.
   * @emits isCategorySelected Sets the state indicating that a category has been selected.
   */
  onCategoryClick(categoryIndex: number): void {
    this.isOpenChange.emit(false);
    const currentCategory = this.surveyService.getCategoryByIndex(categoryIndex);
    if(currentCategory){
      this.sendCategorySelection.emit(currentCategory);
      this.isCategorySelected.set(true);
    }
  }
}
