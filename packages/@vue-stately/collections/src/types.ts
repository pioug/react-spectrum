export interface PartialNode<T> {
  index?: number,
  key?: string | null,
  parentKey?: string | null,
  rendered?: unknown,
  textValue?: string,
  type?: string,
  value?: T
}
