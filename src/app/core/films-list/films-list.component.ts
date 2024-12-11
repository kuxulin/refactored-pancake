import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import FilmsQueryOptions from '../../shared/models/FilmsQueryOptions';
import { CommonModule } from '@angular/common';
import PagedResult from '../../shared/models/PagedResult';
import Film from '../../shared/models/Film';
import { FilmCardComponent } from '../../shared/film-card/film-card.component';
import { FilmService } from '../../shared/services/film.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Form,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { GenresListComponent } from '../../shared/genres-list/genres-list.component';

@Component({
  selector: 'app-films-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FilmCardComponent,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
  ],
  templateUrl: './films-list.component.html',
  styleUrl: './films-list.component.scss',
})
export class FilmsListComponent {
  private _destroy$ = new Subject<boolean>();
  filmsResult$!: Observable<PagedResult<Film>>;
  isArrowUp = false;
  sortText: string | undefined;
  readonly dialog = inject(MatDialog);

  options: FilmsQueryOptions = {
    pageSize: 20,
    pageIndex: 0,
    partialFilmTitle: undefined,
    sortField: undefined,
    crew: undefined,
    genres: undefined,
    year: undefined,
    minRating: undefined,
    maxRating: undefined,
    votes: undefined,
  };
  partialFilmTitleInput = '';
  sortFieldDisplay = new FormControl('');
  filmYear = new FormControl();
  minMark = new FormControl();
  maxMark = new FormControl();
  minVotes = new FormControl();
  private _optionsSubject = new BehaviorSubject<FilmsQueryOptions>(
    this.options
  );

  constructor(private _filmService: FilmService) {}

  updateQuery(newOptions: Partial<FilmsQueryOptions>) {
    this._optionsSubject.next({ ...this._optionsSubject.value, ...newOptions });
  }

  ngOnInit() {
    this._optionsSubject.pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.options = value;

      this.filmsResult$ = this._filmService
        .getPagedFilms(value)
        .pipe(shareReplay());

      if (this.options.partialFilmTitle !== undefined) {
        this.options.crew = undefined;
        this.options.sortField = undefined;
        this.options.genres = undefined;
        this.options.year = undefined;
      }
    });
  }

  searchFilmsByTitle(partialTitle: string) {
    if (!partialTitle) return;

    this.isArrowUp = false;
    this.sortFieldDisplay.setValue('');
    this.updateQuery({ partialFilmTitle: partialTitle, sortField: undefined });
  }

  setSortField(sortField: string | undefined = undefined) {
    if (!sortField) {
      this.updateQuery({ sortField: undefined });
      this.isArrowUp = false;
      this.sortText = undefined;
      this.sortFieldDisplay.setValue('');
      return;
    }

    let ending = 'asc';

    this.sortText = sortField;
    sortField = sortField === 'Title' ? 'title' : 'primary_release_date';

    if (this.options.sortField?.startsWith(sortField)) {
      ending = this.options.sortField.endsWith('asc') ? 'desc' : 'asc';
      this.isArrowUp = !this.isArrowUp;
    } else {
      this.isArrowUp = false;
    }

    this.updateQuery({ sortField: sortField + '.' + ending });
  }

  updateYear(isReseting: boolean = false) {
    if (isReseting) {
      this.filmYear.reset();

      if (this.options.year !== undefined)
        this.updateQuery({ year: this.filmYear.value });
    }

    this.updateQuery({ year: this.filmYear.value });
  }

  clearPartialFilmTitle() {
    this.updateQuery({ partialFilmTitle: undefined });
    this.partialFilmTitleInput = '';
  }

  setMarks(
    marks: Partial<{ minMark: number; maxMark: number; minVotes: number }>
  ) {
    if (!marks.minMark) this.minMark.reset();

    if (!marks.maxMark) this.maxMark.reset();

    if (!marks.minVotes) this.minVotes.reset();

    this.updateQuery({
      minRating: this.minMark.value || undefined,
      maxRating: this.maxMark.value || undefined,
      votes: this.minVotes.value || undefined,
    });
  }

  openGenresSelectionDialog() {
    let dialogRef = this.dialog.open(GenresListComponent, {
      data: { genres: this.options.genres },
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || result.length === 0)
        this.updateQuery({ genres: undefined });
      else this.updateQuery({ genres: result });
    });
  }
}
