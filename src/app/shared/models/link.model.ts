export interface Link {
    href: string,
    rel: { self: string, next_page: string, previous_page: string },
    method: string
}
