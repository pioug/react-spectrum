import {CodeClient} from './CodeClient';
import {CodeFold} from './CodeFold';
import {CodeLink} from './Link';
import {CodeProps} from './VisualExampleClient';
import {createHighlighterCoreSync} from '@shikijs/core';
import cssLang from '@shikijs/langs/css';
import javascriptLang from '@shikijs/langs/javascript';
import jsonLang from '@shikijs/langs/json';
import jsxLang from '@shikijs/langs/jsx';
import tsxLang from '@shikijs/langs/tsx';
import typescriptLang from '@shikijs/langs/typescript';
import vueLang from '@shikijs/langs/vue';
import {createJavaScriptRegexEngine} from '@shikijs/engine-javascript';
import React, {cache} from 'react';
import {style, StyleString} from '@react-spectrum/s2/style' with {type: 'macro'};
import {TabLink} from './FileTabs';
import {Token, TokenType} from './CodeToken';

const property = style({color: 'indigo-1000'});
const fn = style({color: 'red-1000'});
export const styles = {
  keyword: style({color: 'magenta-1000'}),
  string: style({color: 'green-1000'}),
  number: style({color: 'pink-1000'}),
  property,
  attribute: property,
  function: fn,
  tag: fn,
  constructor: fn,
  comment: style({color: 'gray-700'}),
  variable: style({color: 'fuchsia-1000'}),
  import: style({display: '--import-display'})
};

const mark = style({
  display: 'block',
  backgroundColor: 'blue-800/15',
  borderColor: 'blue-800',
  borderWidth: 0,
  borderStartWidth: 2,
  borderStyle: 'solid',
  marginStart: 'calc(var(--code-padding-start) * -1)',
  marginEnd: 'calc(var(--code-padding-end) * -1)',
  paddingStart: 'calc(var(--code-padding-start) - self(borderStartWidth))',
  paddingEnd: '--code-padding-end',
  color: 'inherit'
});

function Highlight({tokens}) {
  return <mark className={mark}><CodeClient tokens={tokens} /></mark>;
}

function Focus({tokens}) {
  return <span><CodeClient tokens={tokens} /></span>;
}

const groupings = {
  highlight: Highlight,
  collapse: CodeFold,
  focus: Focus
};

type Links = {[name: string]: string};
export interface ICodeProps {
  children: string,
  lang?: string,
  isFencedBlock?: boolean,
  hideImports?: boolean,
  links?: Links,
  styles?: StyleString
}

type HastTextNode = {
  type: 'text',
  value: string
};

type HastNode = {
  type: 'element',
  tagName: string,
  properties?: {
    className?: string
  },
  children: (HastNode | HastTextNode)[]
};

type ShikiToken = {
  content: string,
  color?: string
};

type SupportedLanguage = 'css' | 'javascript' | 'json' | 'jsx' | 'tsx' | 'typescript' | 'vue';
type Highlighter = ReturnType<typeof createHighlighterCoreSync>;

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  css: 'css',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue'
};

const SHIKI_THEME_NAME = 'react-spectrum-docs';
const SHIKI_THEME = {
  name: SHIKI_THEME_NAME,
  type: 'light',
  colors: {
    'editor.foreground': 'var(--rsp-code-plain)',
    'editor.background': 'transparent'
  },
  tokenColors: [
    {
      scope: ['comment', 'string.quoted.docstring.multi'],
      settings: {foreground: 'var(--rsp-code-comment)'}
    },
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.character',
        'constant.other.placeholder',
        'constant.character.format.placeholder'
      ],
      settings: {foreground: 'var(--rsp-code-number)'}
    },
    {
      scope: [
        'meta.property-name',
        'meta.object-literal.key',
        'meta.property-value',
        'support.type.property-name.json',
        'variable.other.property',
        'entity.name.property'
      ],
      settings: {foreground: 'var(--rsp-code-property)'}
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: {foreground: 'var(--rsp-code-attribute)'}
    },
    {
      scope: [
        'support.function',
        'entity.name.function',
        'entity.name.type',
        'entity.other.inherited-class',
        'meta.function-call',
        'meta.instance.constructor',
        'support.class.component'
      ],
      settings: {foreground: 'var(--rsp-code-function)'}
    },
    {
      scope: ['entity.name.tag'],
      settings: {foreground: 'var(--rsp-code-tag)'}
    },
    {
      scope: [
        'string',
        'markup.fenced_code',
        'markup.inline'
      ],
      settings: {foreground: 'var(--rsp-code-string)'}
    },
    {
      scope: [
        'variable',
        'variable.parameter',
        'variable.language.this',
        'variable.other.readwrite',
        'variable.other.object',
        'variable.other.constant'
      ],
      settings: {foreground: 'var(--rsp-code-variable)'}
    },
    {
      scope: [
        'keyword',
        'storage.type',
        'storage.modifier',
        'storage.control',
        'keyword.operator',
        'punctuation.separator.key-value',
        'punctuation.definition.template-expression'
      ],
      settings: {foreground: 'var(--rsp-code-keyword)'}
    }
  ]
} as const;

const TOKEN_COLOR_TO_CLASS = new Map<string, keyof typeof styles>([
  ['var(--rsp-code-keyword)', 'keyword'],
  ['var(--rsp-code-string)', 'string'],
  ['var(--rsp-code-number)', 'number'],
  ['var(--rsp-code-property)', 'property'],
  ['var(--rsp-code-attribute)', 'attribute'],
  ['var(--rsp-code-function)', 'function'],
  ['var(--rsp-code-tag)', 'tag'],
  ['var(--rsp-code-comment)', 'comment'],
  ['var(--rsp-code-variable)', 'variable']
]);

const globalHighlighter = globalThis as typeof globalThis & {
  __s2DocsHighlighter?: Highlighter
};

function getHighlighter(): Highlighter {
  if (!globalHighlighter.__s2DocsHighlighter) {
    globalHighlighter.__s2DocsHighlighter = createHighlighterCoreSync({
      themes: [SHIKI_THEME],
      langs: [
        cssLang,
        javascriptLang,
        jsonLang,
        jsxLang,
        tsxLang,
        typescriptLang,
        vueLang
      ],
      engine: createJavaScriptRegexEngine()
    });
  }

  return globalHighlighter.__s2DocsHighlighter;
}

// Check if a language is supported by the server-side syntax highlighter.
function isSupportedLanguage(lang: string): boolean {
  return lang.toLowerCase() in LANGUAGE_ALIASES;
}

function resolveLanguage(lang: string): SupportedLanguage | null {
  return LANGUAGE_ALIASES[lang.toLowerCase()] ?? null;
}

export function Code({children, lang, isFencedBlock, hideImports = true, links, styles}: ICodeProps) {
  // If language is provided and is a supported syntax highlighting language
  if (lang && isSupportedLanguage(lang)) {
    return (
      <code className={styles} style={{fontFamily: 'inherit', WebkitTextSizeAdjust: 'none'}}>
        <CodeClient tokens={highlightCode(children, lang, hideImports, links)} />
      </code>
    );
  }

  // If inside a fenced code block (pre element) or has an unsupported language,
  // render as plain text block without syntax highlighting
  if (isFencedBlock || lang) {
    return (
      <code className={styles} style={{fontFamily: 'inherit', WebkitTextSizeAdjust: 'none'}}>
        {children}
      </code>
    );
  }

  // Inline code style
  return (
    <code
      className={style({
        font: 'code-sm',
        backgroundColor: 'layer-1',
        paddingX: 4,
        borderWidth: 1,
        borderColor: 'gray-100',
        borderStyle: 'solid',
        borderRadius: 'sm',
        whiteSpace: 'pre-wrap'
      })}>
      {children}
    </code>
  );
}

const highlightCode = cache((children: string, lang: string, hideImports = true, links?: Links): Token[] => {
  let lineNodes = highlightLanguageLines(children, resolveLanguage(lang));

  if (!lineNodes.length) {
    return [children];
  }

  lineNodes = groupLinesByMarkerComments(lineNodes);
  let idx = lineNodes.findIndex(line => !/^(["']use client["']|(\s*$))/.test(text(line)));
  if (idx > 0) {
    lineNodes = lineNodes.slice(idx);
  }

  if (hideImports) {
    // Group into hidden and visible nodes.
    // Hidden nodes will include all import statements. If a highlighted block is seen,
    // then we'll hide all the lines up until 2 lines before this.
    let hidden: HastNode[] = [];
    let visible: HastNode[] = [];
    let seenNonImportLine = false;
    let hasHighlight = false;
    for (let line of lineNodes) {
      if (!seenNonImportLine && isCollapsiblePreludeLine(text(line), lang)) {
        hidden.push(line);
      } else {
        seenNonImportLine = true;
        visible.push(line);
      }

      if ((line.tagName === 'highlight' || line.tagName === 'focus') && !hasHighlight) {
        hasHighlight = true;
        // Center highlighted lines within collapsed window (~8 lines).
        let highlightedLines = line.children.length;
        let contextLines = highlightedLines < 6
          ? Math.floor((8 - highlightedLines) / 2)
          : 2;
        contextLines++;
        hidden.push(...visible.slice(0, -contextLines));
        visible = visible.slice(-contextLines);
      }
    }

    if (hidden.length && visible.length) {
      lineNodes = [
        {
          type: 'element',
          tagName: 'span',
          children: hidden,
          properties: {
            className: 'import'
          }
        },
        ...visible
      ];
    }
  }

  return renderChildren(lineNodes, '0', links);
});

function highlightLanguageLines(children: string, language: SupportedLanguage | null): HastNode[] {
  if (!language) {
    return [];
  }

  try {
    let highlighter = getHighlighter();
    let tokens = highlighter.codeToTokensBase(children, {
      lang: language,
      theme: SHIKI_THEME_NAME
    });
    return shikiTokensToLines(tokens);
  } catch {
    return plainTextLines(children);
  }
}

function isCollapsiblePreludeLine(line: string, lang: string): boolean {
  return /^(["']use client["']|@?import|(\s*$))/.test(line);
}

function plainTextLines(children: string): HastNode[] {
  return children.split('\n').map(line => lineNode([textNode(line)]));
}

function textNode(value: string): HastTextNode {
  return {type: 'text', value} as HastTextNode;
}

function spanNode(children: (HastNode | HastTextNode)[], className?: string): HastNode {
  let properties = className ? {className} : undefined;
  return {
    type: 'element',
    tagName: 'span',
    properties,
    children
  } as HastNode;
}

function tokenNode(className: keyof typeof styles, value: string): HastNode {
  return spanNode([textNode(value)], className);
}

function lineNode(children: (HastNode | HastTextNode)[]): HastNode {
  return {
    type: 'element',
    tagName: 'div',
    children: [spanNode(children.length ? children : [textNode('')])]
  } as HastNode;
}

function shikiTokensToLines(lines: ShikiToken[][]): HastNode[] {
  return lines.map(line => lineNode(line.flatMap(renderShikiToken)));
}

function renderShikiToken(token: ShikiToken): (HastNode | HastTextNode)[] {
  if (!token.content) {
    return [];
  }

  let className = token.color ? TOKEN_COLOR_TO_CLASS.get(token.color) : undefined;
  if (className) {
    return [tokenNode(className, token.content)];
  }

  return [textNode(token.content)];
}

type Marker = {
  kind: 'begin' | 'end',
  tag: string
} | null;

function parseLineMarker(line: string): Marker {
  // JS/TS markers (existing docs pattern): /*- begin highlight -*/ or ///- begin highlight -///
  let jsMarker = line.match(/^(?:\/\/\/|\/\*)-\s*(begin|end)\s+([a-z-]+)\s*-(?:\/\/\/|\*\/)$/i);
  if (jsMarker) {
    return {kind: jsMarker[1].toLowerCase() as 'begin' | 'end', tag: jsMarker[2].toLowerCase()};
  }

  // Vue template markers: <!--- begin highlight -->
  let htmlMarker = line.match(/^<!---\s*(begin|end)\s+([a-z-]+)\s*-?-->$/i);
  if (htmlMarker) {
    return {kind: htmlMarker[1].toLowerCase() as 'begin' | 'end', tag: htmlMarker[2].toLowerCase()};
  }

  return null;
}

function groupLinesByMarkerComments(lineNodes: HastNode[]): HastNode[] {
  let grouped: HastNode[] = [];
  let currentGroup: HastNode | null = null;
  let currentTag: string | null = null;

  for (let line of lineNodes) {
    let marker = parseLineMarker(text(line).trim());
    if (marker?.kind === 'begin') {
      currentTag = marker.tag;
      currentGroup = {
        type: 'element',
        tagName: marker.tag,
        children: []
      } as HastNode;
      continue;
    }

    if (marker?.kind === 'end' && currentGroup && currentTag === marker.tag) {
      grouped.push(currentGroup);
      currentGroup = null;
      currentTag = null;
      continue;
    }

    if (currentGroup) {
      currentGroup.children.push(line);
    } else {
      grouped.push(line);
    }
  }

  // In case markers are mismatched, preserve accumulated lines.
  if (currentGroup) {
    grouped.push(...currentGroup.children);
  }

  return grouped;
}

// Renders a Hast Node to a list of tokens. A token is either a string, a React element, or a token type (number) + string.
// These are flattened into an array that gets sent to the client. This format significantly reduces the payload size vs JSX.
function renderHast(node: HastNode | HastTextNode, key: string, links?: Links, indent = ''): Token | Token[] {
  if (node.type === 'element' && 'children' in node) {
    let childArray: Token[] = renderChildren(node.children, key, links);
    if (node.tagName === 'div') {
      if (typeof childArray.at(-1) === 'string' && typeof childArray.at(-2) !== 'number') {
        childArray[childArray.length - 1] += '\n';
      } else {
        childArray.push('\n');
      }
    }

    let tokenType = node.properties?.className?.split(' ').map(c => TokenType[c]).filter(v => v != null) || [];
    if (node.properties?.className === 'comment' && text(node) === '/* PROPS */') {
      return <CodeProps key={key} indent={indent} />;
    }

    // CodeProps includes the indent and newlines in case there are no props to show.
    if (node.tagName === 'div' && typeof childArray[0] === 'string' && /^\s+$/.test(childArray[0]) && React.isValidElement(childArray[1]) && childArray[1].type === CodeProps) {
      // If the only thing after CodeProps is the newline from div processing, exclude it (CodeProps handles its own newlines).
      // Otherwise, include all trailing content.
      childArray = childArray.length === 3 && childArray[2] === '\n'
      ? childArray.slice(1, 2)
      : childArray.slice(1);
    }

    let children = childArray.length === 1 ? childArray[0] : childArray;
    let tagName: any = node.tagName;
    let properties: any = node.properties;
    if (links && typeof children === 'string' && links[children]) {
      let link = links[children];
      return (
        <CodeLink
          key={key}
          className={styles[properties?.className]}
          href={link}>
          {children}
        </CodeLink>
      );
    }

    // Link to imported files.
    if (properties?.className === 'string' && typeof children === 'string' && /^['"]\.\//.test(children)) {
      return (
        <TabLink
          key={key}
          className={styles.string}
          name={children.slice(3, -1)}>
          <CodeClient tokens={childArray} />
        </TabLink>
      );
    }

    if ((tagName === 'div' || tagName === 'span') && tokenType.length === 0) {
      return children;
    }

    let type = groupings[tagName] || tagName;
    if (type === 'div') {
      // we inserted a newline, so treat this as inline.
      type = 'span';
    }

    if (type === 'span') {
      return [tokenType[0], children];
    }

    let className = node.properties?.className?.split(' ').map(c => styles[c]).filter(Boolean).join(' ') || undefined;
    return React.createElement(type, {...properties, className, key, tokens: childArray});
  } else {
    // @ts-ignore
    return node.value;
  }
}

function renderChildren(children: (HastNode | HastTextNode)[], key: string, links?: Links): Token[] {
  let childArray: Token[] = [];
  let type = -1;
  let stringIndex = -1;
  for (let [i, child] of children.entries()) {
    let indent = i === 1 && stringIndex >= 0 && /^\s+$/.test(childArray[stringIndex] as string) ? childArray[stringIndex] as string : '';
    let childNode = renderHast(child, `${key}.${i}`, links, indent);
    let childNodes = Array.isArray(childNode) ? childNode : [childNode];
    let childIndex = 0;
    while (childIndex < childNodes.length) {
      let child = childNodes[childIndex++];
      let childType = -1;
      if (typeof child === 'number') {
        // A number represents a token type. Consume the next value.
        childType = child;
        child = childNodes[childIndex++];
        if (childType !== type) {
          childArray.push(childType);
        }
      }

      // If this is a string, either append to the previous string if it is
      // the same token type, or push a new string.
      if (typeof child === 'string') {
        if (childType !== type) {
          type = childType;
          stringIndex = childArray.length;
          childArray.push(child);
        } else if (stringIndex >= 0) {
          childArray[stringIndex] += child;
        } else {
          stringIndex = childArray.length;
          childArray.push(child);
        }
      } else {
        type = -1;
        stringIndex = -1;
        childArray.push(child);
      }
    }
  }

  return childArray;
}

function text(node) {
  if (node.type === 'text') {
    return node.value;
  } else {
    return node.children.map(c => text(c)).join('');
  }
}
