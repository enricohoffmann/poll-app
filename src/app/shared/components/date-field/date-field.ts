import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { Button } from "../button/button";

@Component({
  selector: 'app-date-field',
  imports: [Button],
  templateUrl: './date-field.html',
  styleUrl: './date-field.scss',
})
export class DateField {

  isPickerOpen = signal(false);

  @ViewChild('dateSelectField') dateSelect!: ElementRef<HTMLInputElement>;

  onCalenderButtonClick(): void{

    if(!this.isPickerOpen()){
      this.dateSelect.nativeElement.showPicker();
    } else {
      this.dateSelect.nativeElement.blur();
    }

    this.isPickerOpen.set(!this.isPickerOpen());

  }

}
