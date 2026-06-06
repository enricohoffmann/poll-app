import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  imports: [Header, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
