import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const STUB_DIR = path.join(SRC_DIR, 'typecheck-stubs');
const STUB_PREFIXES = ['@vue-aria/', '@vue-spectrum/', '@vue-stately/'];

function parseNamedImports(specifier, isTypeOnly, addModuleExport) {
  let body = specifier.slice(1, -1).trim();
  if (!body) {
    return;
  }

  for (let segment of body.split(',')) {
    let token = segment.trim();
    if (!token) {
      continue;
    }

    let tokenIsType = false;
    if (token.startsWith('type ')) {
      tokenIsType = true;
      token = token.slice('type '.length).trim();
    }

    let [exportName] = token.split(/\s+as\s+/);
    exportName = exportName.trim();

    if (!exportName) {
      continue;
    }

    if (exportName === 'default') {
      addModuleExport(true, false);
      continue;
    }

    addModuleExport(false, isTypeOnly || tokenIsType, exportName);
  }
}

function parseImportClause(clause, addModuleExport) {
  let normalized = clause.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return;
  }

  let isTypeOnly = false;
  if (normalized.startsWith('type ')) {
    isTypeOnly = true;
    normalized = normalized.slice('type '.length).trim();
  }

  if (normalized.startsWith('{') && normalized.endsWith('}')) {
    parseNamedImports(normalized, isTypeOnly, addModuleExport);
    return;
  }

  if (normalized.startsWith('* as ')) {
    addModuleExport(false, false);
    return;
  }

  let commaIndex = normalized.indexOf(',');
  let defaultImport = commaIndex >= 0 ? normalized.slice(0, commaIndex).trim() : normalized;
  let remainder = commaIndex >= 0 ? normalized.slice(commaIndex + 1).trim() : '';

  if (defaultImport && !defaultImport.startsWith('{') && !defaultImport.startsWith('*')) {
    addModuleExport(true, isTypeOnly);
  }

  if (!remainder) {
    return;
  }

  if (remainder.startsWith('{') && remainder.endsWith('}')) {
    parseNamedImports(remainder, isTypeOnly, addModuleExport);
    return;
  }

  if (remainder.startsWith('* as ')) {
    addModuleExport(false, false);
  }
}

function listSourceFiles() {
  let output = execSync(
    "rg --files src -g '*.ts' -g '*.vue' -g '!**/*.spec.ts'",
    {cwd: ROOT, encoding: 'utf8'}
  ).trim();

  if (!output) {
    return [];
  }

  return output.split('\n').map((file) => path.join(ROOT, file));
}

function collectImports(files) {
  let modules = new Map();
  let importPattern = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;

  for (let file of files) {
    let source = fs.readFileSync(file, 'utf8');
    let match;

    while ((match = importPattern.exec(source)) !== null) {
      let clause = match[1];
      let moduleSpecifier = match[2];
      if (!STUB_PREFIXES.some((prefix) => moduleSpecifier.startsWith(prefix))) {
        continue;
      }

      let moduleState = modules.get(moduleSpecifier);
      if (!moduleState) {
        moduleState = {
          hasDefault: false,
          names: new Set()
        };
        modules.set(moduleSpecifier, moduleState);
      }

      parseImportClause(clause, (isDefault, _isTypeOnly, exportName) => {
        if (isDefault) {
          moduleState.hasDefault = true;
          return;
        }

        if (exportName) {
          moduleState.names.add(exportName);
        }
      });
    }
  }

  return modules;
}

function writeStubs(modules) {
  fs.rmSync(STUB_DIR, {recursive: true, force: true});

  for (let [moduleSpecifier, state] of modules.entries()) {
    let [scope, ...subPathParts] = moduleSpecifier.split('/');
    let scopeDir = scope.replace(/^@/, '');
    let outFile = path.join(STUB_DIR, scopeDir, `${subPathParts.join('/')}.d.ts`);

    fs.mkdirSync(path.dirname(outFile), {recursive: true});

    let lines = [
      '// Auto-generated for starter-local typecheck isolation.',
      '// Do not edit by hand; run `node scripts/generate-typecheck-stubs.mjs`.'
    ];

    if (state.hasDefault) {
      lines.push('declare const __default: any;');
      lines.push('export default __default;');
    }

    for (let name of [...state.names].sort()) {
      lines.push(`export const ${name}: any;`);
      lines.push(`export type ${name} = any;`);
    }

    if (!state.hasDefault && state.names.size === 0) {
      lines.push('export {};');
    }

    lines.push('');
    fs.writeFileSync(outFile, lines.join('\n'));
  }
}

let files = listSourceFiles();
let modules = collectImports(files);
writeStubs(modules);

