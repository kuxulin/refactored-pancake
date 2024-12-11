import { Routes } from '@angular/router';
import { FilmsListComponent } from './core/films-list/films-list.component';
import { FilmComponent } from './core/film/film.component';

export const routes: Routes = [
  { path: 'films', component: FilmsListComponent },
  { path: '', redirectTo: '/films', pathMatch: 'full' },
  { path: 'films/:id', component: FilmComponent },
];
