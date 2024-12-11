import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import Film from '../../shared/models/Film';
import { FilmService } from '../../shared/services/film.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film.component.html',
  styleUrl: './film.component.scss',
})
export class FilmComponent {
  film$!: Observable<Film>;
  constructor(
    private _route: ActivatedRoute,
    private _filmService: FilmService
  ) {}

  ngOnInit() {
    this.film$ = this._route.paramMap.pipe(
      switchMap((params) => {
        let id = Number(params.get('id'));
        return this._filmService.getFilmById(id);
      })
    );
  }
}
