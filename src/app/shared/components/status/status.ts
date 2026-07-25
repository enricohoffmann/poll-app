import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * @description Component for displaying the status indicator in the poll.
 */
@Component({
  selector: 'app-status',
  imports: [NgClass],
  templateUrl: './status.html',
  styleUrls: ['./status.scss'],
})
export class Status {
  isActive = input(false);
  canHover = input(true);
  
}
