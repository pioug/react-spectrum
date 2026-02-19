export type Key = string | number;

/**
 * A selection set with optional anchor/current keys used for range selection.
 */
export class Selection extends Set<Key> {
  anchorKey: Key | null;
  currentKey: Key | null;

  constructor(
    keys?: Iterable<Key> | Selection,
    anchorKey?: Key | null,
    currentKey?: Key | null
  ) {
    super(keys);

    if (keys instanceof Selection) {
      this.anchorKey = anchorKey ?? keys.anchorKey;
      this.currentKey = currentKey ?? keys.currentKey;
      return;
    }

    this.anchorKey = anchorKey ?? null;
    this.currentKey = currentKey ?? null;
  }
}
