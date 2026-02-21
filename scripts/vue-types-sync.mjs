import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const REACT_TYPES_ROOT = path.join(REPO_ROOT, 'packages', '@react-types');
const VUE_TYPES_ROOT = path.join(REPO_ROOT, 'packages', '@vue-types');

const REACT_SHIM_PACKAGE_NAME = '@vue-types/react';
const REACT_SHIM_VERSION = '0.1.0';

const TEXT_EXTENSIONS = new Set(['.d.ts', '.ts', '.js', '.json', '.md']);
const SKIP_DIRS = new Set(['node_modules', 'dist']);

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceInSource(sourceText) {
  return sourceText
    .replace(/@react-types\//g, '@vue-types/')
    .replace(/@react-aria\//g, '@vue-aria/')
    .replace(/@react-spectrum\//g, '@vue-spectrum/')
    .replace(/@react-stately\//g, '@vue-stately/')
    .replace(/from\s+['"]react['"]/g, `from '${REACT_SHIM_PACKAGE_NAME}'`);
}

function walkFiles(dirPath, callback) {
  for (let entry of fs.readdirSync(dirPath, {withFileTypes: true})) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    let fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, callback);
      continue;
    }

    callback(fullPath);
  }
}

function clearAndCreateDir(dirPath) {
  fs.rmSync(dirPath, {recursive: true, force: true});
  fs.mkdirSync(dirPath, {recursive: true});
}

function copyDirWithTransforms(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, {recursive: true});

  for (let entry of fs.readdirSync(sourceDir, {withFileTypes: true})) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    let sourcePath = path.join(sourceDir, entry.name);
    let targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirWithTransforms(sourcePath, targetPath);
      continue;
    }

    let extension = path.extname(entry.name);
    if (!TEXT_EXTENSIONS.has(extension)) {
      fs.copyFileSync(sourcePath, targetPath);
      continue;
    }

    let sourceText = fs.readFileSync(sourcePath, 'utf8');
    let isDeclarationFile = entry.name.endsWith('.d.ts');
    let targetText = isDeclarationFile ? replaceInSource(sourceText) : sourceText;
    fs.writeFileSync(targetPath, targetText);
  }
}

function renameDependencyEntries(map) {
  if (!map || typeof map !== 'object') {
    return map;
  }

  let next = {};
  for (let [name, version] of Object.entries(map)) {
    let nextName = name
      .replace(/^@react-types\//u, '@vue-types/')
      .replace(/^@react-aria\//u, '@vue-aria/')
      .replace(/^@react-spectrum\//u, '@vue-spectrum/')
      .replace(/^@react-stately\//u, '@vue-stately/');
    next[nextName] = version;
  }

  return next;
}

function hasReactShimImport(packageDir) {
  let hasImport = false;
  walkFiles(packageDir, (filePath) => {
    if (hasImport || path.extname(filePath) !== '.d.ts') {
      return;
    }

    let text = fs.readFileSync(filePath, 'utf8');
    if (text.includes(REACT_SHIM_PACKAGE_NAME)) {
      hasImport = true;
    }
  });

  return hasImport;
}

function ensureReactShimPackage() {
  let reactShimDir = path.join(VUE_TYPES_ROOT, 'react');
  clearAndCreateDir(reactShimDir);
  fs.mkdirSync(path.join(reactShimDir, 'src'), {recursive: true});

  let reactShimPackage = {
    name: REACT_SHIM_PACKAGE_NAME,
    version: REACT_SHIM_VERSION,
    description: 'Vue migration React type compatibility shims',
    license: 'Apache-2.0',
    types: 'src/index.d.ts',
    repository: {
      type: 'git',
      url: 'https://github.com/adobe/react-spectrum'
    },
    publishConfig: {
      access: 'public'
    }
  };

  let reactShimDts = `export type ReactText = string | number;
export type ReactChild = ReactElement | ReactText;
export type ReactNode = ReactChild | boolean | null | undefined | ReactNode[];
export type ElementType = string | JSXElementConstructor<any>;
export type JSXElementConstructor<P> = ((props: P) => unknown) | (new (props: P) => unknown);
export type CSSProperties = Record<string, unknown>;
export type AriaRole = string;
export interface AriaAttributes {
  [key: string]: unknown;
}
export interface DOMAttributes<T = Element> {
  [key: string]: unknown;
}
export interface HTMLAttributes<T = HTMLElement> extends DOMAttributes<T> {
  [key: string]: unknown;
}
export interface ButtonHTMLAttributes<T = HTMLButtonElement> extends HTMLAttributes<T> {}
export interface FormHTMLAttributes<T = HTMLFormElement> extends HTMLAttributes<T> {}
export interface LabelHTMLAttributes<T = HTMLLabelElement> extends HTMLAttributes<T> {}
export type HTMLAttributeAnchorTarget = string;
export type HTMLAttributeReferrerPolicy = string;
export interface MutableRefObject<T> {
  current: T;
}
export type RefCallback<T> = (instance: T | null) => void;
export type RefObject<T> = MutableRefObject<T | null>;
export type Ref<T> = RefCallback<T> | RefObject<T> | null;
export interface RefAttributes<T> {
  ref?: Ref<T>;
}
export interface ReactElement<P = any, T = any> {
  type: T;
  props: P;
  key?: string | number | null;
}
export interface SyntheticEvent<T = Element, E = Event> {
  nativeEvent: E;
  currentTarget: T;
  target: EventTarget | null;
  preventDefault(): void;
  stopPropagation(): void;
}
export interface UIEvent<T = Element, E = globalThis.UIEvent> extends SyntheticEvent<T, E> {}
export interface FocusEvent<T = Element> extends SyntheticEvent<T, globalThis.FocusEvent> {}
export interface MouseEvent<T = Element> extends SyntheticEvent<T, globalThis.MouseEvent> {}
export interface KeyboardEvent<T = Element> extends SyntheticEvent<T, globalThis.KeyboardEvent> {}
export type EventHandler<E extends SyntheticEvent<any, any>> = (event: E) => void;
export type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type ClipboardEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type CompositionEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type FormEvent<T = Element> = SyntheticEvent<T, Event>;
export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
export type PointerEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type TouchEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type WheelEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type AnimationEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type TransitionEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
export type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
export namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
`;

  writeJson(path.join(reactShimDir, 'package.json'), reactShimPackage);
  fs.writeFileSync(path.join(reactShimDir, 'src', 'index.d.ts'), reactShimDts);
  fs.writeFileSync(path.join(reactShimDir, 'README.md'), '# @vue-types/react\n\nType shims used by Vue package migrations.\n');
}

function syncVueTypesPackages() {
  if (!fs.existsSync(REACT_TYPES_ROOT)) {
    throw new Error(`Missing source directory: ${toPosixPath(path.relative(REPO_ROOT, REACT_TYPES_ROOT))}`);
  }

  fs.mkdirSync(VUE_TYPES_ROOT, {recursive: true});
  ensureReactShimPackage();

  let sourcePackages = fs.readdirSync(REACT_TYPES_ROOT, {withFileTypes: true})
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  let synced = [];

  for (let sourceName of sourcePackages) {
    let sourceDir = path.join(REACT_TYPES_ROOT, sourceName);
    let sourcePackageJsonPath = path.join(sourceDir, 'package.json');
    if (!fs.existsSync(sourcePackageJsonPath)) {
      continue;
    }

    let targetDir = path.join(VUE_TYPES_ROOT, sourceName);
    clearAndCreateDir(targetDir);
    copyDirWithTransforms(sourceDir, targetDir);

    let packageJsonPath = path.join(targetDir, 'package.json');
    let packageJson = readJson(packageJsonPath);
    packageJson.name = packageJson.name.replace('@react-types/', '@vue-types/');
    packageJson.dependencies = renameDependencyEntries(packageJson.dependencies);
    packageJson.peerDependencies = renameDependencyEntries(packageJson.peerDependencies);
    packageJson.devDependencies = renameDependencyEntries(packageJson.devDependencies);
    packageJson.optionalDependencies = renameDependencyEntries(packageJson.optionalDependencies);

    if (packageJson.peerDependencies && typeof packageJson.peerDependencies === 'object') {
      delete packageJson.peerDependencies.react;
      delete packageJson.peerDependencies['react-dom'];
      if (Object.keys(packageJson.peerDependencies).length === 0) {
        delete packageJson.peerDependencies;
      }
    }

    if (hasReactShimImport(path.join(targetDir, 'src'))) {
      packageJson.dependencies = packageJson.dependencies ?? {};
      packageJson.dependencies[REACT_SHIM_PACKAGE_NAME] = `^${REACT_SHIM_VERSION}`;
    }

    writeJson(packageJsonPath, packageJson);
    synced.push(packageJson.name);
  }

  return synced;
}

function main() {
  let synced = syncVueTypesPackages();
  console.log(`Synced ${synced.length} packages into ${toPosixPath(path.relative(REPO_ROOT, VUE_TYPES_ROOT))}.`);
}

main();
