import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status',
  imports: [NgClass],
  templateUrl: './status.html',
  styleUrl: './status.scss',
})
export class Status {
  isActive = input(false);
  
}
