interface FilterDOMPropsOptions {
  labelable?: boolean
}

const DOM_PROPS = new Set([
  'id',
  'role',
  'tabindex',
  'tabIndex',
  'style',
  'class',
  'className',
  'title',
  'slot',
  'lang',
  'dir',
  'hidden',
  'target',
  'rel',
  'href'
]);

const LABELABLE_PROPS = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
  'aria-errormessage'
]);

function shouldIncludeAriaProp(key: string, labelable: boolean): boolean {
  if (!key.startsWith('aria-')) {
    return false;
  }

  if (!labelable && LABELABLE_PROPS.has(key)) {
    return false;
  }

  return true;
}

export function filterDOMProps<T extends Record<string, unknown>>(
  props: T,
  options: FilterDOMPropsOptions = {}
): Record<string, unknown> {
  let labelable = Boolean(options.labelable);
  let filteredProps: Record<string, unknown> = {};

  for (let [key, value] of Object.entries(props)) {
    if (
      key.startsWith('data-')
      || key.startsWith('on')
      || DOM_PROPS.has(key)
      || shouldIncludeAriaProp(key, labelable)
    ) {
      filteredProps[key] = value;
    }
  }

  return filteredProps;
}
