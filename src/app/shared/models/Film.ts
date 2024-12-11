import Actor from './Actor';
import Poster from './Poster';

export default interface Film {
  id: number;
  title: string;
  director: string;
  date: Date;
  overview: string;
  actors: Actor[];
  poster: Poster;
}
