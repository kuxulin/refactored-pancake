export default interface PagedResult<T> {
  items: T[];
  totalCount: number;
}
