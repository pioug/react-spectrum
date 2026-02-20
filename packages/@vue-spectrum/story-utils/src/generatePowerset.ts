import {mergeProps} from '@vue-aria/utils';

export type StoryState = Record<string, unknown>;

function hasCombination(combinations: StoryState[], candidate: StoryState): boolean {
  let serialized = JSON.stringify(candidate);
  return combinations.some((combination) => JSON.stringify(combination) === serialized);
}

// Generate a powerset from a given array of states/options.
export function generatePowerset(states: Array<object>, exclude?: (merged: any) => boolean): any[];
export function generatePowerset(states: StoryState[], exclude?: (merged: StoryState) => boolean): StoryState[] {
  let combinations: StoryState[] = [{}];
  let addIfIncluded = (merged: StoryState) => {
    if (!(exclude && exclude(merged))) {
      combinations.push(merged);
    }
  };

  for (let state of states) {
    let entries = Object.entries(state);
    if (entries.length === 0) {
      continue;
    }

    let [key, value] = entries[0];
    let currentLength = combinations.length;

    for (let index = 0; index < currentLength; index++) {
      let combination = combinations[index];

      if (Array.isArray(value)) {
        for (let variant of value) {
          let merged = mergeProps(combination, {[key]: variant}) as StoryState;
          addIfIncluded(merged);
        }
        continue;
      }

      let merged = mergeProps(combination, {[key]: value}) as StoryState;
      if (hasCombination(combinations, merged)) {
        continue;
      }

      addIfIncluded(merged);
    }
  }

  return combinations;
}
