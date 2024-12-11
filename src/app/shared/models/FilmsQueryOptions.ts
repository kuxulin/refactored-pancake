import BaseQueryOptions from './BaseQueryOptions';
import Genre from './Genre';

export default interface FilmsQueryOptions extends BaseQueryOptions {
  partialFilmTitle: string | undefined;
  crew: string | undefined;
  genres: Genre[] | undefined;
  year: number | undefined;
  minRating: number | undefined;
  maxRating: number | undefined;
  votes: number | undefined;
}
