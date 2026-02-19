export type RuntimeStyleProps = Record<string, unknown>;
export type RuntimeStyleInput = Record<string, unknown>;
export type RuntimeStyleOutput = (props?: RuntimeStyleProps) => string;

const PREFIX = 's1-';

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

  tokens.push(`${PREFIX}${propertyToken}-${valueToken}`);
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

export function raw(value: string): `[${string}]` {
  return `[${value}]`;
}

function hash(input: string): string {
  let code = 0;
  for (let index = 0; index < input.length; index++) {
    code = (code * 31 + input.charCodeAt(index)) >>> 0;
  }

  return code.toString(36);
}

export function keyframes(definition: Record<string, unknown> | string): string {
  let source = typeof definition === 'string' ? definition : JSON.stringify(definition);
  return `${PREFIX}keyframes-${hash(source)}`;
}
