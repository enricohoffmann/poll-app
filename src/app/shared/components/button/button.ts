import { Component, input, signal, computed } from '@angular/core';
import { ButtonIconVariant, ButtonVariant } from '../../utils/types';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  private readonly BUTTON_CLASSES: Record<ButtonVariant, string> = {
    primaryBtn: 'btn--primary',
    secondaryBtn: 'btn--secondary',
    tertiaryBtn: 'btn--tertiary',
    filterBtn: 'btn--filter',
    trashBtn: 'btn--trash'
  };

  private readonly BUTTON_ICON_CLASSES: Record<ButtonIconVariant, string> = {
    add: 'btn-icon--add',
    check: 'btn-icon--check',
    addWhite: 'btn-icon--add-white',
    closeWhite: 'btn-icon--close-white'
  }

  buttonVariant = input<ButtonVariant>('primaryBtn');
  buttonClass = computed(() => this.BUTTON_CLASSES[this.buttonVariant()]);
  hasIcon = input(false);
  hasTrashIcon = input(false);
  buttonIconVariant = input<ButtonIconVariant>('add');
  buttonIconClass = computed(() => this.BUTTON_ICON_CLASSES[this.buttonIconVariant()]);
  toggleIsActive = input<boolean>(false);
  isActivated = computed(() => {
    return this.toggleIsActive() && this.buttonVariant() === 'filterBtn';
  });
  buttonType = input<string>('button');
  isDisabled = input<boolean>(false);
  hideTextOnMobile = input<boolean>(false);
  hideText = computed(() => {
    return this.buttonVariant() === 'secondaryBtn' && this.hideTextOnMobile();
  });
  

  ngOnInit(){}

  onButtonClick(){}

}
