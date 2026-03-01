import type {
  keyframes as reactKeyframes,
  raw as reactRaw
} from '../../../@react-spectrum/style-macro-s1/src/style-macro';

export type RuntimeStyleProps = Record<string, unknown>;
export type RuntimeStyleInput = Record<string, unknown>;
export type RuntimeStyleOutput = (props?: RuntimeStyleProps) => string;

const PREFIX = 's1-';
const STYLE_TAG_ATTRIBUTE = 'data-vue-spectrum-style-macro-s1';
const injectedTokens = new Set<string>();
const COLOR_TOKEN_FAMILIES = new Set([
  'blue',
  'celery',
  'chartreuse',
  'cyan',
  'fuchsia',
  'gray',
  'green',
  'indigo',
  'magenta',
  'orange',
  'purple',
  'red',
  'seafoam',
  'yellow'
]);
const FONT_SIZE_TOKENS: Record<string, string> = {
  lg: '16px',
  md: '14px',
  sm: '12px',
  xl: '18px',
  xs: '11px'
};
const RADIUS_TOKENS: Record<string, string> = {
  default: '4px',
  full: '9999px',
  lg: '8px',
  md: '6px',
  none: '0px',
  sm: '2px'
};
const SPACING_TOKENS: Record<string, string> = {
  '0': '0px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '3.5': '14px',
  '4': '16px',
  '4.5': '18px',
  '5': '20px',
  '5.5': '22px',
  '6': '24px',
  '6.5': '26px',
  '7': '28px',
  '8': '32px',
  '9': '36px'
};

function sanitizeToken(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function resolveConditional(value: unknown, props: RuntimeStyleProps): unknown {
  if (value === null || value === undefined || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  let conditional = value as Record<string, unknown>;

  for (let key of Object.keys(conditional)) {
    if ((key.startsWith('is') || key.startsWith('allows')) && props[key]) {
      return resolveConditional(conditional[key], props);
    }

    if (key in props && conditional[key] && typeof conditional[key] === 'object' && !Array.isArray(conditional[key])) {
      let variants = conditional[key] as Record<string, unknown>;
      let variantKey = String(props[key]);
      if (variantKey in variants) {
        return resolveConditional(variants[variantKey], props);
      }
    }
  }

  if ('default' in conditional) {
    return resolveConditional(conditional.default, props);
  }

  return undefined;
}

function getStyleTag(): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let existing = document.head.querySelector(`style[${STYLE_TAG_ATTRIBUTE}]`);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }

  let styleTag = document.createElement('style');
  styleTag.setAttribute(STYLE_TAG_ATTRIBUTE, '');
  document.head.append(styleTag);
  return styleTag;
}

function escapeClassName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
}

function normalizeRuntimeValue(value: string): string {
  let trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith('--')) {
    return `var(${trimmed})`;
  }

  return trimmed;
}

function resolveColor(value: string): string {
  if (value === 'black' || value === 'transparent' || value === 'white') {
    return value;
  }

  if (value.startsWith('var(') || value.startsWith('light-dark(') || /^[A-Z]/.test(value)) {
    return value;
  }

  let accentMatch = value.match(/^accent-(\d+)$/);
  if (accentMatch) {
    return `var(--spectrum-accent-color-${accentMatch[1]})`;
  }

  let colorMatch = value.match(/^([a-z]+)-(\d+)$/);
  if (colorMatch && COLOR_TOKEN_FAMILIES.has(colorMatch[1])) {
    return `var(--spectrum-${colorMatch[1]}-${colorMatch[2]})`;
  }

  return value;
}

function resolveSpacing(value: string): string {
  if (value in SPACING_TOKENS) {
    return SPACING_TOKENS[value];
  }

  let numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return `${numeric * 4}px`;
  }

  return value;
}

function resolveFontSize(value: string): string {
  return FONT_SIZE_TOKENS[value] ?? value;
}

function resolveBorderRadius(value: string): string {
  return RADIUS_TOKENS[value] ?? value;
}

function createDeclaration(propertyToken: string, rawValue: string): string | undefined {
  if (propertyToken === 'backgroundcolor') {
    return `background-color: ${resolveColor(rawValue)};`;
  }

  if (propertyToken === 'color') {
    return `color: ${resolveColor(rawValue)};`;
  }

  if (propertyToken === 'fontsize') {
    return `font-size: ${resolveFontSize(rawValue)};`;
  }

  if (propertyToken === 'paddingx') {
    return `padding-inline: ${resolveSpacing(rawValue)};`;
  }

  if (propertyToken === 'paddingy') {
    return `padding-block: ${resolveSpacing(rawValue)};`;
  }

  if (propertyToken === 'borderradius') {
    return `border-radius: ${resolveBorderRadius(rawValue)};`;
  }

  return undefined;
}

function ensureRuntimeRule(token: string, propertyToken: string, value: unknown): void {
  if (injectedTokens.has(token)) {
    return;
  }

  let styleTag = getStyleTag();
  if (!styleTag) {
    return;
  }

  let declaration = createDeclaration(propertyToken, normalizeRuntimeValue(String(value)));
  if (!declaration) {
    return;
  }

  styleTag.append(document.createTextNode(`.${escapeClassName(token)} { ${declaration} }\n`));
  injectedTokens.add(token);
}

function appendToken(tokens: string[], property: string, value: unknown): void {
  if (value === null || value === undefined || value === false) {
    return;
  }

  if (Array.isArray(value)) {
    for (let entry of value) {
      appendToken(tokens, property, entry);
    }
    return;
  }

  let propertyToken = sanitizeToken(property);
  let valueToken = sanitizeToken(String(value));
  if (!propertyToken || !valueToken) {
    return;
  }

  let token = `${PREFIX}${propertyToken}-${valueToken}`;
  tokens.push(token);
  ensureRuntimeRule(token, propertyToken, value);
}

export function style(definition: RuntimeStyleInput): RuntimeStyleOutput {
  return (props = {}) => {
    let tokens: string[] = [];

    for (let [property, value] of Object.entries(definition)) {
      appendToken(tokens, property, resolveConditional(value, props));
    }

    return tokens.join(' ');
  };
}

export const raw: typeof reactRaw = ((value: string) => `[${value}]`) as unknown as typeof reactRaw;

function hash(input: string): string {
  let code = 0;
  for (let index = 0; index < input.length; index++) {
    code = (code * 31 + input.charCodeAt(index)) >>> 0;
  }

  return code.toString(36);
}

const keyframesRuntime = (definition: Record<string, unknown> | string): string => {
  let source = typeof definition === 'string' ? definition : JSON.stringify(definition);
  return `${PREFIX}keyframes-${hash(source)}`;
};

export const keyframes: typeof reactKeyframes = keyframesRuntime as unknown as typeof reactKeyframes;
