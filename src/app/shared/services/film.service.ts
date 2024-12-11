import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import FilmsQueryOptions from '../models/FilmsQueryOptions';
import Film from '../models/Film';
import { map, tap } from 'rxjs';
import PagedResult from '../models/PagedResult';
import { environment } from '../../../environments/environment';
import Genre from '../models/Genre';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private readonly _url = 'https://api.themoviedb.org/3/';
  private readonly _posterUrl = 'https://image.tmdb.org/t/p/w185';
  constructor(private _http: HttpClient) {}

  getPagedFilms(query: FilmsQueryOptions) {
    let params = this.createHttpParams(query);

    if (query.partialFilmTitle !== undefined)
      return this.getMoviesByTitle(params).pipe(
        map((res) => this.mapMovies(res))
      );

    let complexQuery = this._http
      .get<PagedResult<Film>>(this._url + 'discover/movie', {
        params: params,
      })
      .pipe(map((res) => this.mapMovies(res)));

    return complexQuery;
  }

  private mapMovies(res: any) {
    let filmsResult = {
      items: res.results as Film[],
      totalCount: res.total_results,
    };
    for (let i = 0; i < filmsResult.items.length; i++) {
      filmsResult.items[i].poster = {
        name: 'poster',
        source: this._posterUrl + res.results[i].poster_path,
      };
    }
    return filmsResult;
  }

  private getMoviesByTitle(params: HttpParams) {
    return this._http.get<PagedResult<Film>>(this._url + 'search/movie', {
      params: params,
    });
  }

  private createHttpParams(options: Partial<FilmsQueryOptions>): HttpParams {
    let params = new HttpParams();
    params = params.set('api_key', environment.apiKey);

    if (options.pageIndex !== undefined)
      params = params.set('page', (options.pageIndex + 1).toString());

    if (options.partialFilmTitle !== undefined) {
      params = params.set(
        'query',
        options.partialFilmTitle.replaceAll(' ', '+')
      );
      return params;
    }

    if (options.sortField !== undefined)
      params = params.set('sort_by', options.sortField);

    if (options.crew !== undefined)
      params = params.set('with_crew', options.crew);

    if (options.genres !== undefined)
      params = params.set(
        'with_genres',
        options.genres.map((g) => g.id).join(',')
      );

    if (options.year !== undefined)
      params = params.set('primary_release_year', options.year);

    if (options.minRating !== undefined)
      params = params.set('vote_average.gte', options.minRating);

    if (options.maxRating !== undefined)
      params = params.set('vote_average.lte', options.maxRating);

    if (options.votes !== undefined)
      params = params.set('vote_count.gte', options.votes);

    return params;
  }

  getGenres() {
    return this._http
      .get<Genre[]>(this._url + 'genre/movie/list', {
        params: {
          api_key: environment.apiKey,
        },
      })
      .pipe(map((res: any) => res.genres as Genre[]));
  }

  getFilmById(id: number) {
    return this._http
      .get<Film>(this._url + `movie/${id}`, {
        params: {
          api_key: environment.apiKey,
        },
      })
      .pipe(tap((res) => console.log(res)));
  }
}
