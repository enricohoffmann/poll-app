import { Component, ElementRef, signal, ViewChild, input } from '@angular/core';
import { Button } from "../button/button";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * @description A custom date field component that manages its own form control and date picker interactions.
 */
@Component({
  selector: 'app-date-field',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './date-field.html',
  styleUrls: ['./date-field.scss'],
})
export class DateField {

  isPickerOpen = signal(false);
  @ViewChild('dateSelectField') dateSelect!: ElementRef<HTMLInputElement>;
  dateInputControl = input.required<FormControl<string | null>>();
  isWriting = signal<boolean>(false);

  /**
   * @description Handles the click event on the calendar button, triggering the date picker to open.
   * @returns { void } No return value.
   */
  onCalenderButtonClick(): void {
    this.dateSelect.nativeElement.showPicker();
  }

  /**
   * @description Handles the change event from the date picker, converting the selected date to German format and updating the form control.
   * @returns { void } No return value.
   */
  onDatePickerChange(): void {
    const germanDate = this.getGermanDate(this.dateSelect.nativeElement.value);
    this.dateInputControl().setValue(germanDate);
    this.dateInputControl().markAsTouched();
    this.isPickerOpen.set(false);
  }

  /**
   * @description Converts a date string from the format 'YYYY-MM-DD' to the German date format 'DD.MM.YYYY'.
   * @param rawDate The date string in the format 'YYYY-MM-DD'.
   * @returns {string} The date string converted to the German format 'DD.MM.YYYY'.
   */
  getGermanDate(rawDate: string): string {
    const dateArray = rawDate.split('-');
    return `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`;
  }

  /**
   * @description Clears the value of the date input form control, effectively resetting the date field.
   * @returns { void } No return value.
   */
  clearDateField(): void {
    this.dateInputControl().setValue('');
  }

  /**
   * @description Sets the isWriting signal to true when the user starts interacting with the date field.
   * @returns { void } No return value.
   */
  onDateFieldEnter(): void {
    this.isWriting.set(true);
  }

  /**
   * @description Sets the isWriting signal to false when the user stops interacting with the date field.
   * @returns { void } No return value.
   */
  onDateFieldLeave(): void {
    this.isWriting.set(false);
  }

  /**
   * @description Formats a Date object into a string in the format 'YYYY-MM-DD'.
   * @param date The Date object to format.
   * @returns {string} The formatted date string.
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * @description The minimum selectable date for the date picker, formatted as 'YYYY-MM-DD'.
   * @returns {string} The minimum date string in the format 'YYYY-MM-DD'.
   */
  minDate = this.formatDate(new Date());

}
