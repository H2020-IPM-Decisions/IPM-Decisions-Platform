export interface Link {
    href: string;
    method: string;
    rel: string | { self: string, next_page: string, previous_page: string };
}