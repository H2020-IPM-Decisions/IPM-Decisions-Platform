export interface IPagination {
    TotalCount: number,
    PageSize: number,
    CurrentPage: number,
    TotalPages: number,
    HasPrevious: boolean,
    HasNext: boolean,
    IsFirstPage: boolean,
    IsLastPage: boolean
}