export interface ItemProps<T> {
  key?: string,
  textValue?: string,
  value?: T
}

export function Item<T>(props: ItemProps<T>): ItemProps<T> {
  return props;
}
