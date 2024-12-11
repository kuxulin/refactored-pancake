import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import Genre from '../models/Genre';
import { FilmService } from '../services/film.service';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './genres-list.component.html',
  styleUrl: './genres-list.component.scss',
})
export class GenresListComponent {
  availableGenres$!: Observable<Genre[]>;
  selectedGenres: Genre[] = [];
  readonly data = inject<{ genres: Genre[] }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<GenresListComponent>);

  constructor(private _filmService: FilmService) {}

  ngOnInit() {
    this.selectedGenres = this.data.genres ? this.data.genres : [];
    this.fetchGenres();
  }

  fetchGenres() {
    this.availableGenres$ = this._filmService
      .getGenres()
      .pipe(
        map((res) =>
          res.filter(
            (genre) => !this.selectedGenres.some((g) => g.id === genre.id)
          )
        )
      );
  }

  addGenreToSelected(genre: Genre) {
    this.selectedGenres.push(genre);
    this.fetchGenres();
  }

  removeGenreFromSelected(genre: Genre) {
    this.selectedGenres.splice(this.selectedGenres.indexOf(genre), 1);
    this.fetchGenres();
  }

  sendGenres() {
    if (this.selectedGenres.length === 0) return;

    this.dialogRef.close(this.selectedGenres);
  }
}
