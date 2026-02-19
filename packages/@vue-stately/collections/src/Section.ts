export interface SectionProps<T> {
  items?: Iterable<T>,
  key?: string,
  title?: string
}

export function Section<T>(props: SectionProps<T>): SectionProps<T> {
  return props;
}
