import {CodeClient} from './CodeClient';
import {CodeFold} from './CodeFold';
import {CodeLink} from './Link';
import {CodeProps} from './VisualExampleClient';
import {HastNode, HastTextNode, highlightHast, Language} from 'tree-sitter-highlight';
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

const LANGUAGE_ALIASES: Record<string, keyof typeof Language> = {
  css: 'CSS',
  js: 'JS',
  json: 'JS',
  jsx: 'JSX',
  ts: 'TS',
  tsx: 'TSX'
};

// Check if a language is supported by tree-sitter for syntax highlighting
function isSupportedLanguage(lang: string): boolean {
  let normalized = lang.toLowerCase();
  return normalized === 'vue' || normalized in LANGUAGE_ALIASES;
}

function resolveLanguage(lang: string): keyof typeof Language | null {
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
  let lineNodes = lang.toLowerCase() === 'vue'
    ? highlightVueLines(children)
    : highlightLanguageLines(children, resolveLanguage(lang));

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

function highlightLanguageLines(children: string, language: keyof typeof Language | null): HastNode[] {
  if (!language) {
    return [];
  }

  try {
    return lines(highlightHast(children, Language[language]));
  } catch {
    return plainTextLines(children);
  }
}

function highlightInlineCode(children: string, language: keyof typeof Language): (HastNode | HastTextNode)[] {
  if (!children) {
    return [];
  }

  try {
    let highlighted = highlightHast(children, Language[language]);
    return highlighted.children as (HastNode | HastTextNode)[];
  } catch {
    return [textNode(children)];
  }
}

function isCollapsiblePreludeLine(line: string, lang: string): boolean {
  let normalized = lang.toLowerCase();
  if (normalized === 'vue') {
    return /^(["']use client["']|@?import|(\s*$)|<(?:script|style)\b[^>]*>|<\/(?:script|style)>$)$/.test(line);
  }

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

function highlightVueLines(children: string): HastNode[] {
  let result: HastNode[] = [];
  let mode: 'template' | 'script' | 'style' | null = null;
  let blockLanguage: keyof typeof Language = 'JS';
  let blockLines: string[] = [];
  let templateState = {inTag: false};

  let flushBlock = () => {
    if (!blockLines.length) {
      return;
    }

    result.push(...highlightLanguageLines(blockLines.join('\n'), blockLanguage));
    blockLines = [];
  };

  for (let line of children.split('\n')) {
    let trimmed = line.trim();

    if (mode === 'script' || mode === 'style') {
      if (trimmed === `</${mode}>`) {
        flushBlock();
        result.push(highlightVueTemplateLine(line, {inTag: false}));
        mode = null;
        continue;
      }

      blockLines.push(line);
      continue;
    }

    if (mode === 'template') {
      if (trimmed === '</template>') {
        result.push(highlightVueTemplateLine(line, {inTag: false}));
        templateState.inTag = false;
        mode = null;
        continue;
      }

      result.push(highlightVueTemplateLine(line, templateState));
      continue;
    }

    if (/^<template\b/.test(trimmed)) {
      result.push(highlightVueTemplateLine(line, {inTag: false}));
      mode = 'template';
      templateState.inTag = false;
      continue;
    }

    if (/^<script\b/.test(trimmed)) {
      result.push(highlightVueTemplateLine(line, {inTag: false}));
      mode = 'script';
      blockLanguage = resolveVueScriptLanguage(line);
      continue;
    }

    if (/^<style\b/.test(trimmed)) {
      result.push(highlightVueTemplateLine(line, {inTag: false}));
      mode = 'style';
      blockLanguage = 'CSS';
      continue;
    }

    result.push(highlightVueTemplateLine(line, {inTag: false}));
  }

  flushBlock();
  return result;
}

function resolveVueScriptLanguage(line: string): keyof typeof Language {
  let match = line.match(/\blang\s*=\s*["']([^"']+)["']/i);
  let language = match?.[1].toLowerCase();

  switch (language) {
    case 'jsx':
      return 'JSX';
    case 'tsx':
      return 'TSX';
    case 'ts':
    case 'typescript':
      return 'TS';
    default:
      return 'JS';
  }
}

function highlightVueTemplateLine(line: string, state: {inTag: boolean}): HastNode {
  let children: (HastNode | HastTextNode)[] = [];
  let index = 0;

  while (index < line.length) {
    if (!state.inTag && line.startsWith('<!--', index)) {
      let end = line.indexOf('-->', index + 4);
      let comment = end >= 0 ? line.slice(index, end + 3) : line.slice(index);
      children.push(tokenNode('comment', comment));
      index += comment.length;
      continue;
    }

    if (!state.inTag && line.startsWith('{{', index)) {
      let end = line.indexOf('}}', index + 2);
      if (end < 0) {
        children.push(textNode(line.slice(index)));
        break;
      }

      children.push(textNode('{{'));
      children.push(...highlightVueInterpolation(line.slice(index + 2, end)));
      children.push(textNode('}}'));
      index = end + 2;
      continue;
    }

    if (!state.inTag && line[index] === '<') {
      let tag = highlightVueTagFragment(line, index, false);
      children.push(...tag.children);
      index = tag.index;
      state.inTag = tag.inTag;
      continue;
    }

    if (state.inTag) {
      let tag = highlightVueTagFragment(line, index, true);
      children.push(...tag.children);
      index = tag.index;
      state.inTag = tag.inTag;
      continue;
    }

    let nextTag = line.indexOf('<', index);
    let nextComment = line.indexOf('<!--', index);
    let nextInterpolation = line.indexOf('{{', index);
    let nextIndex = [nextTag, nextComment, nextInterpolation]
      .filter(value => value >= 0)
      .reduce((min, value) => Math.min(min, value), line.length);
    children.push(textNode(line.slice(index, nextIndex)));
    index = nextIndex;
  }

  return lineNode(children);
}

function highlightVueInterpolation(expression: string): (HastNode | HastTextNode)[] {
  let leading = expression.match(/^\s*/)?.[0] ?? '';
  let trailing = expression.match(/\s*$/)?.[0] ?? '';
  let content = expression.slice(leading.length, expression.length - trailing.length);
  let children: (HastNode | HastTextNode)[] = [];

  if (leading) {
    children.push(textNode(leading));
  }

  children.push(...highlightInlineCode(content, 'TS'));

  if (trailing) {
    children.push(textNode(trailing));
  }

  return children;
}

function highlightVueTagFragment(line: string, start: number, isContinuation: boolean): {
  children: (HastNode | HastTextNode)[],
  index: number,
  inTag: boolean
} {
  let children: (HastNode | HastTextNode)[] = [];
  let index = start;

  if (!isContinuation) {
    if (line.startsWith('</', index)) {
      children.push(textNode('</'));
      index += 2;
    } else {
      children.push(textNode('<'));
      index += 1;
    }

    let tagEnd = index;
    while (tagEnd < line.length && !/[\s/>]/.test(line[tagEnd])) {
      tagEnd++;
    }

    if (tagEnd > index) {
      children.push(tokenNode('tag', line.slice(index, tagEnd)));
    }

    index = tagEnd;
  }

  while (index < line.length) {
    if (/\s/.test(line[index])) {
      let whitespaceEnd = index + 1;
      while (whitespaceEnd < line.length && /\s/.test(line[whitespaceEnd])) {
        whitespaceEnd++;
      }

      children.push(textNode(line.slice(index, whitespaceEnd)));
      index = whitespaceEnd;
      continue;
    }

    if (line.startsWith('/>', index)) {
      children.push(textNode('/>'));
      return {children, index: index + 2, inTag: false};
    }

    if (line[index] === '>') {
      children.push(textNode('>'));
      return {children, index: index + 1, inTag: false};
    }

    let attributeEnd = index;
    while (attributeEnd < line.length && !/[\s=/>]/.test(line[attributeEnd])) {
      attributeEnd++;
    }

    if (attributeEnd > index) {
      children.push(tokenNode('attribute', line.slice(index, attributeEnd)));
    }

    index = attributeEnd;

    let whitespaceEnd = index;
    while (whitespaceEnd < line.length && /\s/.test(line[whitespaceEnd])) {
      whitespaceEnd++;
    }

    if (whitespaceEnd > index) {
      children.push(textNode(line.slice(index, whitespaceEnd)));
      index = whitespaceEnd;
    }

    if (line[index] !== '=') {
      continue;
    }

    children.push(textNode('='));
    index += 1;

    whitespaceEnd = index;
    while (whitespaceEnd < line.length && /\s/.test(line[whitespaceEnd])) {
      whitespaceEnd++;
    }

    if (whitespaceEnd > index) {
      children.push(textNode(line.slice(index, whitespaceEnd)));
      index = whitespaceEnd;
    }

    if (index >= line.length) {
      break;
    }

    let quote = line[index];
    if (quote === '"' || quote === '\'') {
      let valueEnd = index + 1;
      while (valueEnd < line.length && line[valueEnd] !== quote) {
        valueEnd++;
      }

      if (valueEnd < line.length) {
        valueEnd++;
      }

      children.push(tokenNode('string', line.slice(index, valueEnd)));
      index = valueEnd;
      continue;
    }

    let valueEnd = index;
    while (valueEnd < line.length && !/[\s>]/.test(line[valueEnd])) {
      valueEnd++;
    }

    children.push(tokenNode('string', line.slice(index, valueEnd)));
    index = valueEnd;
  }

  return {children, index, inTag: true};
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

function lines(node: HastNode) {
  let resultLines: HastNode[] = [];
  let currentLine: (HastNode | HastTextNode)[] = [];
  // let properties: Record<string, string> = {};
  let grouping: HastNode | null = null;
  let skip = false;
  let endLine = () => {
    if (skip) {
      skip = false;
      currentLine = [];
      return;
    }
    let childNode = {
      type: 'element',
      tagName: 'div',
      children: [{...node, children: currentLine}]
    } as HastNode;
    if (grouping) {
      grouping.children.push(childNode);
    } else {
      resultLines.push(childNode);
    }
    currentLine = [];
  };

  for (let child of node.children) {
    if (child.type === 'text' && 'value' in child) {
      let parts = child.value.split('\n');
      for (let part of parts.slice(0, -1)) {
        if (part.length) {
          currentLine.push({type: 'text', value: part});
        }
        endLine();
      }
      let last = parts.at(-1);
      if (last?.length) {
        currentLine.push({type: 'text', value: last});
      }
      continue;
    } else if ('properties' in child && child.properties?.className === 'comment') {
      let comment = text(child);
      let begin = comment.match(/^(?:\/\/\/|\/\*)- begin (.+) -(?:\/\/\/|\*\/)$/);
      if (begin) {
        grouping = {
          type: 'element',
          tagName: begin[1],
          children: []
        } as any;
        currentLine = [];
        skip = true;
        continue;
      } else if (grouping && (comment.startsWith('///- end ') || comment.startsWith('/*- end '))) {
        resultLines.push(grouping);
        grouping = null;
        currentLine = [];
        skip = true;
        continue;
      }
    }

    let result = lines(child as HastNode);
    if (result.length) {
      currentLine.push(...result[0].children);
    }
    if (result.length > 1) {
      endLine();
      for (let i = 1; i < result.length - 1; i++) {
        currentLine = result[i].children;
        endLine();
      }
      currentLine = result.at(-1)!.children;
    }
  }

  if (currentLine.length) {
    endLine();
  }

  return resultLines;
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

    let tokenType = node.properties?.className.split(' ').map(c => TokenType[c]).filter(v => v != null) || [];
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

    let className = node.properties?.className.split(' ').map(c => styles[c]).filter(Boolean).join(' ') || undefined;
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
