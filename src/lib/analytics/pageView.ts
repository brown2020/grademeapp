export type PageViewParams = {
  page_path: string;
  page_location: string;
  page_title: string;
};

/** GA4 page_view fields for a client navigation. Query string stays on the path. */
export function pageViewParams(
  pathname: string,
  search: string,
  href: string,
  title: string,
): PageViewParams {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const query = search && search !== "?" ? (search.startsWith("?") ? search : `?${search}`) : "";
  return {
    page_path: `${path}${query}`,
    page_location: href,
    page_title: title,
  };
}
