import { Component, inject, signal, output, OnInit, input, computed } from '@angular/core';
import { SurveyService } from '../../../services/survey-service';
import { Category } from '../../../interfaces/category-interface';

/**
 * @description This component is responsible for rendering a drop-down menu that allows users to select a category from a list of categories fetched from the SurveyService. 
 * It manages the state of the menu (open/closed) and emits the selected category when a user makes a selection.
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


  onCategoryClick(categoryIndex: number | null): void {
    this.isOpenChange.emit(false);
    if(categoryIndex) {
      this.handleCategoryById(categoryIndex);
    }else {
      this.handleCategoryAll();
    }
  }

  handleCategoryAll(): void {
    this.sendCategorySelection.emit(null);
  }

  handleCategoryById(id: number): void {
    const currentCategory = this.surveyService.getCategoryByIndex(id);
    if (currentCategory) {
      this.sendCategorySelection.emit(currentCategory);
    }
  }
}
