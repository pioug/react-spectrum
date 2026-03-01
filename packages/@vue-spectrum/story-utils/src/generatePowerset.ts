import {mergeProps} from '@vue-aria/utils';

export type StoryState = Record<string, unknown>;

// Generate a powerset from a given array of states/options,
export function generatePowerset(states: Array<object>, exclude?: (merged: any) => boolean): any[];
export function generatePowerset(states: StoryState[], exclude?: (merged: StoryState) => boolean): StoryState[] {
  let combinations: StoryState[] = [{}];
  for (let i = 0; i < states.length; i++) {
    let len = combinations.length;
    for (let j = 0; j < len; j++) {
      let [key, value] = Object.entries(states[i])[0] as [string, unknown];

      if (Array.isArray(value)) {
        value.forEach((state) => {
          let merged = mergeProps(combinations[j], {[key]: state}) as StoryState;
          if (!(exclude && exclude(merged))) {
            combinations.push(merged);
          }
        });
      } else {
        let merged = mergeProps(combinations[j], states[i]) as StoryState;
        let s = JSON.stringify(merged);
        if (combinations.some((c) => JSON.stringify(c) === s)) {
          continue;
        }

        if (!(exclude && exclude(merged))) {
          combinations.push(merged);
        }
      }
    }
  }

  return combinations;
}
