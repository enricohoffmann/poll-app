import { Component, input, computed } from '@angular/core';
import { ButtonIconVariant, ButtonVariant } from '../../utils/types';
import { NgClass } from '@angular/common';

/**
 * @description Component for rendering a customizable button with various variants and icon options.
 */
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {

  /**
   * @description A mapping of button variants to their corresponding CSS classes.
   */
  private readonly BUTTON_CLASSES: Record<ButtonVariant, string> = {
    primaryBtn: 'btn--primary',
    secondaryBtn: 'btn--secondary',
    tertiaryBtn: 'btn--tertiary',
    filterBtn: 'btn--filter',
    trashBtn: 'btn--trash',
    homeMobile: 'btn--home-mobile'
  };

  /**
   * @description A mapping of button icon variants to their corresponding CSS classes.
   */
  private readonly BUTTON_ICON_CLASSES: Record<ButtonIconVariant, string> = {
    add: 'btn-icon--add',
    check: 'btn-icon--check',
    addWhite: 'btn-icon--add-white',
    closeWhite: 'btn-icon--close-white',
    closePurple: 'btn-icon--close-purple'
  };

  buttonVariant = input<ButtonVariant>('primaryBtn');

  /**
   * @description Computed property that returns the CSS class for the button based on its variant.
   * @returns {string} The CSS class for the button.
   */
  buttonClass = computed(() => this.BUTTON_CLASSES[this.buttonVariant()]);
  hasIcon = input(false);
  hasTrashIcon = input(false);
  buttonIconVariant = input<ButtonIconVariant>('add');
  /**
   * @description Computed property that returns the CSS class for the button icon based on its variant.
   * @returns {string} The CSS class for the button icon.
   */
  buttonIconClass = computed(() => this.BUTTON_ICON_CLASSES[this.buttonIconVariant()]);
  toggleIsActive = input<boolean>(false);

  /**
   * @description Computed property that determines if the button is activated based on its active state and variant.
   * @returns {boolean} True if the button is activated, false otherwise.
   */
  isActivated = computed(() => {
    return this.toggleIsActive() && this.buttonVariant() === 'filterBtn';
  });
  
  buttonType = input<string>('button');
  isDisabled = input<boolean>(false);
  hideTextOnMobile = input<boolean>(false);

  /**
   * @description Computed property that determines if the button text should be hidden based on its variant and mobile visibility setting.
   * @returns {boolean} True if the button text should be hidden, false otherwise.
   */
  hideText = computed(() => {
    return (this.buttonVariant() === 'secondaryBtn' && this.hideTextOnMobile()) || this.buttonVariant() === 'homeMobile';
  });
  isDarkFontColor = input<boolean>(false);

}
