type DOMProps = Record<string, unknown>;
type AriaLabelingProps = Record<string, unknown>;
type LinkDOMProps = Record<string, unknown>;
type GlobalDOMAttributes = Record<string, unknown>;

interface Options {
  labelable?: boolean,
  isLink?: boolean,
  global?: boolean,
  events?: boolean,
  propNames?: Set<string>
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
  'hidden'
]);

const LABELABLE_PROPS = new Set([
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-details',
  'aria-errormessage'
]);

const LINK_PROPS = new Set([
  'href',
  'hrefLang',
  'target',
  'rel',
  'download',
  'ping',
  'referrerPolicy'
]);

const GLOBAL_PROPS = new Set([
  'inert',
  'translate'
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

export function filterDOMProps(
  props: DOMProps & AriaLabelingProps & LinkDOMProps & GlobalDOMAttributes,
  options: Options = {}
): DOMProps & AriaLabelingProps & GlobalDOMAttributes {
  let labelable = Boolean(options.labelable);
  let includeLinkProps = Boolean(options.isLink);
  let includeGlobalProps = Boolean(options.global);
  let includeEvents = options.events ?? includeGlobalProps;
  let filteredProps: Record<string, unknown> = {};

  for (let [key, value] of Object.entries(props)) {
    if (
      key.startsWith('data-')
      || (includeEvents && key.startsWith('on'))
      || DOM_PROPS.has(key)
      || (includeLinkProps && LINK_PROPS.has(key))
      || (includeGlobalProps && GLOBAL_PROPS.has(key))
      || options.propNames?.has(key)
      || shouldIncludeAriaProp(key, labelable)
    ) {
      filteredProps[key] = value;
    }
  }

  return filteredProps as DOMProps & AriaLabelingProps & GlobalDOMAttributes;
}
