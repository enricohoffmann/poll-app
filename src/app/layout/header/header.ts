import { Component, input } from '@angular/core';
import { HeaderVariant } from '../../shared/utils/types';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isPurple = input(false);
  isButtonAvailable = input(false);
}
