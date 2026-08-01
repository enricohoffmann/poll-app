import { Component, inject, output, input } from '@angular/core';
import { SurveyService } from '../../../services/survey-service';
import { Category } from '../../../interfaces/category-interface';

/**
 * @description DropDownMenu component is responsible for rendering a drop-down menu that allows users to select a category from a list. 
 * It manages the state of the menu (open or closed) and emits events when a category is selected or when the menu state changes.
 */
@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrls: ['./drop-down-menu.scss'],
})
export class DropDownMenu {
  isMenuOpen = input.required<boolean>();
  surveyService = inject(SurveyService);
  sendCategorySelection = output<Category | null>();
  isCategorySelected = input.required<boolean>();
  isOpenChange = output<boolean>();
  categoryList = input.required<Category[]>();

  /**
   * @description Toggles the state of the drop-down menu between open and closed when the button is clicked.
   * @returns void
   * @memberof DropDownMenu
   */
  onButtonClick(): void {
    this.isOpenChange.emit(!this.isMenuOpen());
  }


  /**
   * @description Handles the event when a category is clicked in the drop-down menu. It emits the selected category or null if no category is selected.  
   * @param categoryIndex The index of the selected category in the category list.
   * @returns void
   * @memberof DropDownMenu
   */
  onCategoryClick(categoryIndex: number | null): void {
    this.isOpenChange.emit(false);
    if(categoryIndex) {
      this.handleCategoryById(categoryIndex);
    }else {
      this.handleCategoryAll();
    }
  }

  /**
   * @description Emits null to indicate that no specific category is selected, effectively resetting the category selection.
   * @returns void
   * @memberof DropDownMenu
   */
  handleCategoryAll(): void {
    this.sendCategorySelection.emit(null);
  }

  /**
   * @description Emits the selected category based on its index in the category list.
   * @param id The index of the selected category in the category list.
   * @returns void
   * @memberof DropDownMenu
   */
  handleCategoryById(id: number): void {
    const currentCategory = this.surveyService.getCategoryByIndex(id);
    if (currentCategory) {
      this.sendCategorySelection.emit(currentCategory);
    }
  }
}
