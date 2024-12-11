import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import Film from '../models/Film';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './film-card.component.html',
  styleUrl: './film-card.component.scss',
})
export class FilmCardComponent {
  @Input({ required: true })
  film!: Film;
}
