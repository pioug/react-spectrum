import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const STATUS_FILE = path.join(REPO_ROOT, 'migration', 'vue-migration-status.json');
const API_REPORT_JSON = path.join(REPO_ROOT, 'migration', 'vue-api-parity-report.json');
const API_REPORT_MD = path.join(REPO_ROOT, 'migration', 'VUE_API_PARITY_REPORT.md');
const API_PRIORITY_JSON = path.join(REPO_ROOT, 'migration', 'vue-api-parity-priority.json');
const API_PRIORITY_MD = path.join(REPO_ROOT, 'migration', 'VUE_API_PARITY_PRIORITY.md');
const API_SIGNATURE_REPORT_JSON = path.join(REPO_ROOT, 'migration', 'vue-api-signature-parity-report.json');
const API_SIGNATURE_REPORT_MD = path.join(REPO_ROOT, 'migration', 'VUE_API_SIGNATURE_PARITY_REPORT.md');

const STATUS_ORDER = ['in_progress', 'ported', 'planned', 'blocked', 'not_started'];

const SCOPED_PACKAGE_ROOTS = [
  'packages/@react-aria',
  'packages/@react-spectrum',
  'packages/@react-stately'
];

const SINGLE_PACKAGE_PATHS = [
  'packages/react-aria/package.json',
  'packages/react-stately/package.json',
  'packages/react-aria-components/package.json',
  'packages/tailwindcss-react-aria-components/package.json'
];

const SOURCE_FILE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs'
];

let workspacePackageRoots = null;
const workspaceModuleResolutionCache = new Map();
const workspaceEntrypointCache = new Map();
const collectedExportCache = new Map();

const TYPE_FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.UseFullyQualifiedType |
  ts.TypeFormatFlags.WriteArrowStyleSignature |
  ts.TypeFormatFlags.MultilineObjectLiterals;

const SIGNATURE_FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.WriteArrowStyleSignature;

function parseArgs(args) {
  let command = args[0] ?? 'api-report';
  let write = args.includes('--write');
  let maxMissing = 0;
  let maxMismatches = 0;
  let maxMissingIndex = args.indexOf('--max-missing');
  if (maxMissingIndex !== -1 && args[maxMissingIndex + 1]) {
    maxMissing = Number(args[maxMissingIndex + 1]);
    if (!Number.isFinite(maxMissing) || maxMissing < 0) {
      throw new Error(`Invalid --max-missing value: ${args[maxMissingIndex + 1]}`);
    }
  }

  let maxMismatchesIndex = args.indexOf('--max-mismatches');
  if (maxMismatchesIndex !== -1 && args[maxMismatchesIndex + 1]) {
    maxMismatches = Number(args[maxMismatchesIndex + 1]);
    if (!Number.isFinite(maxMismatches) || maxMismatches < 0) {
      throw new Error(`Invalid --max-mismatches value: ${args[maxMismatchesIndex + 1]}`);
    }
  }

  return {command, write, maxMissing, maxMismatches};
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function discoverSourcePackages() {
  let packages = [];

  for (let root of SCOPED_PACKAGE_ROOTS) {
    let rootPath = path.join(REPO_ROOT, root);
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    for (let entry of fs.readdirSync(rootPath).sort()) {
      let packageJsonPath = path.join(rootPath, entry, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        continue;
      }

      let pkg = readJson(packageJsonPath);
      packages.push({
        sourcePackage: pkg.name,
        sourcePath: path.dirname(path.relative(REPO_ROOT, packageJsonPath))
      });
    }
  }

  for (let packageJsonRelPath of SINGLE_PACKAGE_PATHS) {
    let packageJsonPath = path.join(REPO_ROOT, packageJsonRelPath);
    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    let pkg = readJson(packageJsonPath);
    packages.push({
      sourcePackage: pkg.name,
      sourcePath: path.dirname(packageJsonRelPath)
    });
  }

  return packages
    .sort((a, b) => a.sourcePackage.localeCompare(b.sourcePackage))
    .filter((pkg, index, all) => index === 0 || pkg.sourcePackage !== all[index - 1].sourcePackage);
}

function discoverWorkspacePackageRoots() {
  let packageRoots = new Map();
  let packagesRoot = path.join(REPO_ROOT, 'packages');
  if (!fs.existsSync(packagesRoot)) {
    return packageRoots;
  }

  for (let entry of fs.readdirSync(packagesRoot).sort()) {
    let entryPath = path.join(packagesRoot, entry);
    if (!fs.statSync(entryPath).isDirectory()) {
      continue;
    }

    if (entry.startsWith('@')) {
      for (let scopedEntry of fs.readdirSync(entryPath).sort()) {
        let packageRoot = path.join(entryPath, scopedEntry);
        let packageJsonPath = path.join(packageRoot, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
          continue;
        }

        let pkg = readJson(packageJsonPath);
        packageRoots.set(pkg.name, packageRoot);
      }
      continue;
    }

    let packageJsonPath = path.join(entryPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    let pkg = readJson(packageJsonPath);
    packageRoots.set(pkg.name, entryPath);
  }

  return packageRoots;
}

function getWorkspacePackageRoots() {
  if (!workspacePackageRoots) {
    workspacePackageRoots = discoverWorkspacePackageRoots();
  }

  return workspacePackageRoots;
}

function deriveTargetPackage(sourcePackage) {
  if (sourcePackage.startsWith('@react-spectrum/')) {
    return sourcePackage.replace('@react-spectrum/', '@vue-spectrum/');
  }

  if (sourcePackage.startsWith('@react-aria/')) {
    return sourcePackage.replace('@react-aria/', '@vue-aria/');
  }

  if (sourcePackage.startsWith('@react-stately/')) {
    return sourcePackage.replace('@react-stately/', '@vue-stately/');
  }

  if (sourcePackage === 'react-aria-components') {
    return '@vue-spectrum/components';
  }

  if (sourcePackage === 'react-aria') {
    return 'vue-aria';
  }

  if (sourcePackage === 'react-stately') {
    return 'vue-stately';
  }

  if (sourcePackage === 'tailwindcss-react-aria-components') {
    return 'tailwindcss-vue-aria-components';
  }

  return sourcePackage;
}

function deriveTargetPath(targetPackage) {
  if (targetPackage.startsWith('@')) {
    let [scope, name] = targetPackage.split('/');
    return path.posix.join('packages', scope, name);
  }

  return path.posix.join('packages', targetPackage);
}

function buildTrackerEntries(sourcePackages, statusConfig) {
  let overrides = statusConfig.ports ?? {};
  let sourceNames = new Set(sourcePackages.map(pkg => pkg.sourcePackage));

  for (let sourcePackage of Object.keys(overrides)) {
    if (!sourceNames.has(sourcePackage)) {
      throw new Error(`Unknown source package in migration status file: ${sourcePackage}`);
    }
  }

  let entries = sourcePackages.map((pkg) => {
    let override = overrides[pkg.sourcePackage] ?? {};
    let status = override.status ?? 'not_started';
    if (!STATUS_ORDER.includes(status)) {
      throw new Error(`Invalid status "${status}" for ${pkg.sourcePackage}.`);
    }

    let targetPackage = override.targetPackage ?? deriveTargetPackage(pkg.sourcePackage);
    let targetPath = override.targetPath ?? deriveTargetPath(targetPackage);
    return {
      sourcePackage: pkg.sourcePackage,
      sourcePath: pkg.sourcePath,
      targetPackage,
      targetPath,
      status
    };
  });

  entries.sort((a, b) => a.sourcePackage.localeCompare(b.sourcePackage));
  return entries;
}

function ensureRelativeFile(basePath) {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }

  for (let extension of SOURCE_FILE_EXTENSIONS) {
    let withExtension = `${basePath}${extension}`;
    if (fs.existsSync(withExtension) && fs.statSync(withExtension).isFile()) {
      return withExtension;
    }
  }

  for (let extension of SOURCE_FILE_EXTENSIONS) {
    let indexFile = path.join(basePath, `index${extension}`);
    if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) {
      return indexFile;
    }
  }

  return null;
}

function isSignatureComparableFile(filePath) {
  return SOURCE_FILE_EXTENSIONS.includes(path.extname(filePath));
}

function getExportCandidatesFromPackageJson(pkgJson) {
  let candidates = [];

  if (typeof pkgJson.source === 'string') {
    candidates.push(pkgJson.source);
  }

  let dotExport = pkgJson.exports?.['.'];
  if (typeof dotExport === 'string') {
    candidates.push(dotExport);
  } else if (dotExport && typeof dotExport === 'object') {
    for (let key of ['source', 'import', 'module', 'default', 'types', 'require']) {
      if (typeof dotExport[key] === 'string') {
        candidates.push(dotExport[key]);
      }
    }
  }

  for (let key of ['module', 'main', 'types']) {
    if (typeof pkgJson[key] === 'string') {
      candidates.push(pkgJson[key]);
    }
  }

  for (let fallback of ['src/index.ts', 'src/index.tsx', 'src/index.js', 'index.ts', 'index.tsx', 'index.js']) {
    candidates.push(fallback);
  }

  return [...new Set(candidates)];
}

function resolvePackageEntrypoint(packageRoot) {
  let packageJsonPath = path.join(packageRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  let pkgJson = readJson(packageJsonPath);
  let candidates = getExportCandidatesFromPackageJson(pkgJson);

  for (let candidate of candidates) {
    let cleanedCandidate = candidate.replace(/^\.\//, '');
    let absoluteCandidate = path.resolve(packageRoot, cleanedCandidate);
    let resolved = ensureRelativeFile(absoluteCandidate);
    if (resolved) {
      return resolved;
    }
  }

  return null;
}

function hasModifier(node, modifierKind) {
  return Boolean(node.modifiers?.some(modifier => modifier.kind === modifierKind));
}

function collectBindingNames(nameNode, names) {
  if (ts.isIdentifier(nameNode)) {
    names.add(nameNode.text);
    return;
  }

  if (ts.isObjectBindingPattern(nameNode) || ts.isArrayBindingPattern(nameNode)) {
    for (let element of nameNode.elements) {
      if (ts.isBindingElement(element)) {
        collectBindingNames(element.name, names);
      }
    }
  }
}

function resolveRelativeModule(fromFilePath, moduleSpecifier) {
  let basePath = path.resolve(path.dirname(fromFilePath), moduleSpecifier);
  return ensureRelativeFile(basePath);
}

function splitModuleSpecifier(moduleSpecifier) {
  if (moduleSpecifier.startsWith('@')) {
    let parts = moduleSpecifier.split('/');
    if (parts.length < 2) {
      return null;
    }

    return {
      packageName: `${parts[0]}/${parts[1]}`,
      subpath: parts.slice(2).join('/')
    };
  }

  let parts = moduleSpecifier.split('/');
  if (parts.length === 0) {
    return null;
  }

  return {
    packageName: parts[0],
    subpath: parts.slice(1).join('/')
  };
}

function resolveWorkspaceModule(moduleSpecifier) {
  if (workspaceModuleResolutionCache.has(moduleSpecifier)) {
    return workspaceModuleResolutionCache.get(moduleSpecifier);
  }

  let specifierParts = splitModuleSpecifier(moduleSpecifier);
  if (!specifierParts) {
    workspaceModuleResolutionCache.set(moduleSpecifier, null);
    return null;
  }

  let {packageName, subpath} = specifierParts;
  let packageRoot = getWorkspacePackageRoots().get(packageName);
  if (!packageRoot) {
    workspaceModuleResolutionCache.set(moduleSpecifier, null);
    return null;
  }

  if (subpath) {
    let subpathCandidates = [
      path.join(packageRoot, subpath),
      path.join(packageRoot, 'src', subpath)
    ];

    for (let candidate of subpathCandidates) {
      let resolved = ensureRelativeFile(candidate);
      if (resolved) {
        workspaceModuleResolutionCache.set(moduleSpecifier, resolved);
        return resolved;
      }
    }
  }

  if (workspaceEntrypointCache.has(packageName)) {
    let cachedEntrypoint = workspaceEntrypointCache.get(packageName);
    workspaceModuleResolutionCache.set(moduleSpecifier, cachedEntrypoint);
    return cachedEntrypoint;
  }

  let entrypoint = resolvePackageEntrypoint(packageRoot);
  workspaceEntrypointCache.set(packageName, entrypoint);
  workspaceModuleResolutionCache.set(moduleSpecifier, entrypoint);
  return entrypoint;
}

function resolveModule(fromFilePath, moduleSpecifier) {
  if (moduleSpecifier.startsWith('.')) {
    return resolveRelativeModule(fromFilePath, moduleSpecifier);
  }

  return resolveWorkspaceModule(moduleSpecifier);
}

function collectNamedExports(filePath, visitedFiles = new Set()) {
  if (!filePath || visitedFiles.has(filePath) || !fs.existsSync(filePath)) {
    return new Set();
  }

  if (collectedExportCache.has(filePath)) {
    return new Set(collectedExportCache.get(filePath));
  }

  visitedFiles.add(filePath);

  let content = fs.readFileSync(filePath, 'utf8');
  let sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  let exports = new Set();

  for (let statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      exports.add('default');
      continue;
    }

    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause) {
        if (ts.isNamedExports(statement.exportClause)) {
          for (let element of statement.exportClause.elements) {
            exports.add(element.name.text);
          }
        } else if (ts.isNamespaceExport(statement.exportClause)) {
          exports.add(statement.exportClause.name.text);
        }
      } else if (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        let specifier = statement.moduleSpecifier.text;
        let resolved = resolveModule(filePath, specifier);
        for (let exportName of collectNamedExports(resolved, visitedFiles)) {
          exports.add(exportName);
        }
      }
      continue;
    }

    let isExported = hasModifier(statement, ts.SyntaxKind.ExportKeyword);
    if (!isExported) {
      continue;
    }

    let isDefault = hasModifier(statement, ts.SyntaxKind.DefaultKeyword);
    if (isDefault) {
      exports.add('default');
    }

    if (isDefault) {
      continue;
    }

    if (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement) ||
        ts.isModuleDeclaration(statement)) {
      if (statement.name) {
        exports.add(statement.name.text);
      }
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (let declaration of statement.declarationList.declarations) {
        collectBindingNames(declaration.name, exports);
      }
    }
  }

  visitedFiles.delete(filePath);
  collectedExportCache.set(filePath, new Set(exports));
  return exports;
}

function normalizeVueExports(exportNames) {
  let normalized = new Set(exportNames);
  for (let exportName of exportNames) {
    if (exportName.startsWith('Vue') && exportName.length > 3) {
      let stripped = exportName.slice(3);
      if (/^[A-Z]/.test(stripped)) {
        normalized.add(stripped);
      }
    }
  }
  return normalized;
}

function comparePackageApiParity(entry) {
  let sourceRoot = path.join(REPO_ROOT, entry.sourcePath);
  let targetRoot = path.join(REPO_ROOT, entry.targetPath);
  let sourceEntrypoint = resolvePackageEntrypoint(sourceRoot);
  let targetEntrypoint = resolvePackageEntrypoint(targetRoot);

  if (!sourceEntrypoint || !targetEntrypoint) {
    return {
      ...entry,
      sourceEntrypoint,
      targetEntrypoint,
      sourceExportCount: 0,
      targetExportCount: 0,
      parityRatio: 0,
      missingExports: [],
      extraExports: [],
      error: `Unable to resolve ${!sourceEntrypoint ? 'source' : 'target'} entrypoint`
    };
  }

  let sourceExports = collectNamedExports(sourceEntrypoint);
  let targetExports = collectNamedExports(targetEntrypoint);
  let normalizedTargetExports = normalizeVueExports(targetExports);

  let missingExports = [...sourceExports].filter(exportName => !normalizedTargetExports.has(exportName)).sort();
  let extraExports = [...targetExports].filter(exportName => !sourceExports.has(exportName)).sort();
  let parityRatio = sourceExports.size === 0
    ? 1
    : Number(((sourceExports.size - missingExports.length) / sourceExports.size).toFixed(4));

  return {
    ...entry,
    sourceEntrypoint: path.relative(REPO_ROOT, sourceEntrypoint),
    targetEntrypoint: path.relative(REPO_ROOT, targetEntrypoint),
    sourceExportCount: sourceExports.size,
    targetExportCount: targetExports.size,
    parityRatio,
    missingExports,
    extraExports,
    error: null
  };
}

function buildApiParityReport(entries) {
  let packageReports = entries.map(comparePackageApiParity);
  let erroredPackages = packageReports.filter(report => report.error);
  let comparedPackages = packageReports.filter(report => !report.error);
  let missingExportTotal = comparedPackages.reduce((sum, report) => sum + report.missingExports.length, 0);
  let sourceExportTotal = comparedPackages.reduce((sum, report) => sum + report.sourceExportCount, 0);
  let parityCoverage = sourceExportTotal === 0
    ? 1
    : Number(((sourceExportTotal - missingExportTotal) / sourceExportTotal).toFixed(4));
  let fullyMatchedPackages = comparedPackages.filter(report => report.missingExports.length === 0).length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      trackedPackages: entries.length,
      comparedPackages: comparedPackages.length,
      erroredPackages: erroredPackages.length,
      fullyMatchedPackages,
      sourceExportTotal,
      missingExportTotal,
      parityCoverage
    },
    packages: packageReports.sort((a, b) => {
      if (a.error && !b.error) {
        return -1;
      }
      if (!a.error && b.error) {
        return 1;
      }
      return b.missingExports.length - a.missingExports.length || a.sourcePackage.localeCompare(b.sourcePackage);
    })
  };
}

function buildApiParityMarkdown(report) {
  let lines = [];
  lines.push('# Vue API Parity Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`* Tracked packages: ${report.summary.trackedPackages}`);
  lines.push(`* Compared packages: ${report.summary.comparedPackages}`);
  lines.push(`* Errored packages: ${report.summary.erroredPackages}`);
  lines.push(`* Fully matched packages: ${report.summary.fullyMatchedPackages}`);
  lines.push(`* Source exports inspected: ${report.summary.sourceExportTotal}`);
  lines.push(`* Missing exports: ${report.summary.missingExportTotal}`);
  lines.push(`* Coverage ratio: ${(report.summary.parityCoverage * 100).toFixed(2)}%`);
  lines.push('');
  lines.push('## Package gaps');
  lines.push('');
  lines.push('| Source | Target | Status | Source exports | Missing | Coverage |');
  lines.push('| --- | --- | --- | ---: | ---: | ---: |');

  for (let pkg of report.packages) {
    let status = pkg.error ? `error: ${pkg.error}` : (pkg.missingExports.length === 0 ? 'ok' : 'missing');
    let coverage = pkg.error ? '-' : `${(pkg.parityRatio * 100).toFixed(1)}%`;
    lines.push(`| \`${pkg.sourcePackage}\` | \`${pkg.targetPackage}\` | ${status} | ${pkg.sourceExportCount} | ${pkg.missingExports.length} | ${coverage} |`);
  }

  lines.push('');
  lines.push('## Largest gaps');
  lines.push('');
  for (let pkg of report.packages.filter(item => !item.error && item.missingExports.length > 0).slice(0, 20)) {
    lines.push(`### ${pkg.sourcePackage} -> ${pkg.targetPackage}`);
    lines.push('');
    lines.push(`* Source entry: \`${pkg.sourceEntrypoint}\``);
    lines.push(`* Target entry: \`${pkg.targetEntrypoint}\``);
    lines.push(`* Missing export count: ${pkg.missingExports.length}`);
    lines.push(`* Missing exports: \`${pkg.missingExports.slice(0, 40).join('`, `')}\`${pkg.missingExports.length > 40 ? ' ...' : ''}`);
    lines.push('');
  }

  return lines.join('\n');
}

function normalizeSignatureText(text) {
  if (!text) {
    return '';
  }

  let normalized = text
    .replace(/@react-spectrum\//g, '@vue-spectrum/')
    .replace(/@react-aria\//g, '@vue-aria/')
    .replace(/@react-stately\//g, '@vue-stately/')
    .replace(/\breact-aria-components\b/g, '@vue-spectrum/components')
    .replace(/\breact-aria\b/g, 'vue-aria')
    .replace(/\breact-stately\b/g, 'vue-stately')
    .replace(/\b([A-Za-z0-9_]+)Compat\b/g, '$1')
    .replace(/\bMaybeRef<([^<>]+)>\b/g, '$1')
    .replace(/\bVue([A-Z][A-Za-z0-9_]*)\b/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.includes('|')) {
    let parts = normalized.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
      let uniqueParts = toSortedUnique(parts);
      normalized = uniqueParts.join(' | ');
    }
  }

  return normalized;
}

function collectModuleExports(checker, sourceFile) {
  let byName = new Map();
  let byNormalizedName = new Map();
  let moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    return {byName, byNormalizedName};
  }

  for (let exportSymbol of checker.getExportsOfModule(moduleSymbol)) {
    byName.set(exportSymbol.name, exportSymbol);
    if (!byNormalizedName.has(exportSymbol.name)) {
      byNormalizedName.set(exportSymbol.name, exportSymbol);
    }

    if (exportSymbol.name.startsWith('Vue') && exportSymbol.name.length > 3) {
      let stripped = exportSymbol.name.slice(3);
      if (/^[A-Z]/.test(stripped) && !byNormalizedName.has(stripped)) {
        byNormalizedName.set(stripped, exportSymbol);
      }
    }
  }

  return {byName, byNormalizedName};
}

function resolveAliasedSymbol(checker, symbol) {
  if (symbol.flags & ts.SymbolFlags.Alias) {
    try {
      return checker.getAliasedSymbol(symbol);
    } catch {
      return symbol;
    }
  }

  return symbol;
}

function getSymbolDeclarationNode(symbol, fallbackNode = null) {
  if (symbol.valueDeclaration) {
    return symbol.valueDeclaration;
  }

  if (symbol.declarations && symbol.declarations.length > 0) {
    return symbol.declarations[0];
  }

  return fallbackNode;
}

function toSortedUnique(values) {
  return [...new Set(values)].sort();
}

function buildExportSignatureDescriptor(checker, exportSymbol, fallbackNode) {
  let resolved = resolveAliasedSymbol(checker, exportSymbol);
  let location = getSymbolDeclarationNode(resolved, fallbackNode);
  let hasType = Boolean(resolved.flags & ts.SymbolFlags.Type);
  let hasValue = Boolean(resolved.flags & ts.SymbolFlags.Value);
  let declarationKinds = toSortedUnique((resolved.declarations ?? []).map((declaration) => ts.SyntaxKind[declaration.kind]));

  let valueType = '';
  let declaredType = '';
  let callSignatures = [];
  let constructSignatures = [];

  try {
    let symbolType = checker.getTypeOfSymbolAtLocation(resolved, location);
    valueType = normalizeSignatureText(checker.typeToString(symbolType, location, TYPE_FORMAT_FLAGS));
    callSignatures = toSortedUnique(symbolType.getCallSignatures().map((signature) => {
      return normalizeSignatureText(checker.signatureToString(signature, location, SIGNATURE_FORMAT_FLAGS));
    }));
    constructSignatures = toSortedUnique(symbolType.getConstructSignatures().map((signature) => {
      return normalizeSignatureText(checker.signatureToString(signature, location, SIGNATURE_FORMAT_FLAGS));
    }));
  } catch {
    // Best effort only.
  }

  if (hasType) {
    try {
      let symbolDeclaredType = checker.getDeclaredTypeOfSymbol(resolved);
      declaredType = normalizeSignatureText(checker.typeToString(symbolDeclaredType, location, TYPE_FORMAT_FLAGS));
    } catch {
      // Best effort only.
    }
  }

  return {
    name: exportSymbol.name,
    resolvedName: resolved.name,
    hasType,
    hasValue,
    declarationKinds,
    valueType,
    declaredType,
    callSignatures,
    constructSignatures
  };
}

function compareSignatureField(sourceValue, targetValue, fieldName, differences) {
  if (sourceValue === targetValue) {
    return;
  }

  differences.push(fieldName);
}

function isComponentLikeExport(exportName) {
  return /^[A-Z]/.test(exportName);
}

function diffExportSignatures(sourceDescriptor, targetDescriptor) {
  let differences = [];
  compareSignatureField(sourceDescriptor.hasValue, targetDescriptor.hasValue, 'value-availability', differences);
  let componentLike = isComponentLikeExport(sourceDescriptor.name);
  if (!componentLike) {
    compareSignatureField(sourceDescriptor.hasType, targetDescriptor.hasType, 'type-availability', differences);
  }

  let hasCallSignatures = sourceDescriptor.callSignatures.length > 0 || targetDescriptor.callSignatures.length > 0;
  if (hasCallSignatures && !componentLike) {
    compareSignatureField(
      sourceDescriptor.callSignatures.join(' | '),
      targetDescriptor.callSignatures.join(' | '),
      'call-signatures',
      differences
    );
  } else if (!componentLike) {
    compareSignatureField(sourceDescriptor.valueType, targetDescriptor.valueType, 'value-type', differences);
  }

  let hasConstructSignatures = sourceDescriptor.constructSignatures.length > 0 || targetDescriptor.constructSignatures.length > 0;
  if (hasConstructSignatures && !componentLike) {
    compareSignatureField(
      sourceDescriptor.constructSignatures.join(' | '),
      targetDescriptor.constructSignatures.join(' | '),
      'construct-signatures',
      differences
    );
  }

  if (!componentLike && sourceDescriptor.hasType) {
    compareSignatureField(sourceDescriptor.declaredType, targetDescriptor.declaredType, 'declared-type', differences);
  }

  return differences;
}

function buildSignatureProgram(entries) {
  let rootNames = new Set();

  for (let entry of entries) {
    let sourceRoot = path.join(REPO_ROOT, entry.sourcePath);
    let targetRoot = path.join(REPO_ROOT, entry.targetPath);
    let sourceEntrypoint = resolvePackageEntrypoint(sourceRoot);
    let targetEntrypoint = resolvePackageEntrypoint(targetRoot);

    if (sourceEntrypoint && isSignatureComparableFile(sourceEntrypoint)) {
      rootNames.add(sourceEntrypoint);
    }

    if (targetEntrypoint && isSignatureComparableFile(targetEntrypoint)) {
      rootNames.add(targetEntrypoint);
    }
  }

  if (rootNames.size === 0) {
    return null;
  }

  return ts.createProgram({
    rootNames: [...rootNames],
    options: {
      allowJs: true,
      checkJs: false,
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
      resolveJsonModule: true,
      skipLibCheck: true,
      strict: false,
      target: ts.ScriptTarget.ESNext
    }
  });
}

function comparePackageApiSignatures(entry, program, checker) {
  let sourceRoot = path.join(REPO_ROOT, entry.sourcePath);
  let targetRoot = path.join(REPO_ROOT, entry.targetPath);
  let sourceEntrypoint = resolvePackageEntrypoint(sourceRoot);
  let targetEntrypoint = resolvePackageEntrypoint(targetRoot);

  if (!sourceEntrypoint || !targetEntrypoint) {
    return {
      ...entry,
      sourceEntrypoint: sourceEntrypoint ? path.relative(REPO_ROOT, sourceEntrypoint) : null,
      targetEntrypoint: targetEntrypoint ? path.relative(REPO_ROOT, targetEntrypoint) : null,
      sourceExportCount: 0,
      comparedExportCount: 0,
      matchedExportCount: 0,
      mismatchedExportCount: 0,
      missingInTargetCount: 0,
      parityRatio: 0,
      missingInTargetExports: [],
      mismatches: [],
      truncatedMismatchCount: 0,
      error: `Unable to resolve ${!sourceEntrypoint ? 'source' : 'target'} entrypoint`
    };
  }

  if (!isSignatureComparableFile(sourceEntrypoint) || !isSignatureComparableFile(targetEntrypoint)) {
    return {
      ...entry,
      sourceEntrypoint: path.relative(REPO_ROOT, sourceEntrypoint),
      targetEntrypoint: path.relative(REPO_ROOT, targetEntrypoint),
      sourceExportCount: 0,
      comparedExportCount: 0,
      matchedExportCount: 0,
      mismatchedExportCount: 0,
      missingInTargetCount: 0,
      parityRatio: 1,
      missingInTargetExports: [],
      mismatches: [],
      truncatedMismatchCount: 0,
      error: null
    };
  }

  let sourceFile = program.getSourceFile(sourceEntrypoint);
  let targetFile = program.getSourceFile(targetEntrypoint);
  if (!sourceFile || !targetFile) {
    return {
      ...entry,
      sourceEntrypoint: path.relative(REPO_ROOT, sourceEntrypoint),
      targetEntrypoint: path.relative(REPO_ROOT, targetEntrypoint),
      sourceExportCount: 0,
      comparedExportCount: 0,
      matchedExportCount: 0,
      mismatchedExportCount: 0,
      missingInTargetCount: 0,
      parityRatio: 0,
      missingInTargetExports: [],
      mismatches: [],
      truncatedMismatchCount: 0,
      error: 'Unable to load source files in TypeScript program'
    };
  }

  let sourceExports = collectModuleExports(checker, sourceFile);
  let targetExports = collectModuleExports(checker, targetFile);
  let mismatches = [];
  let missingInTargetExports = [];
  let matchedExportCount = 0;
  let comparedExportCount = 0;
  let mismatchedExportCount = 0;

  for (let [exportName, sourceSymbol] of sourceExports.byName) {
    let targetSymbol = targetExports.byName.get(exportName) ?? targetExports.byNormalizedName.get(exportName);
    if (!targetSymbol) {
      missingInTargetExports.push(exportName);
      continue;
    }

    comparedExportCount++;
    let sourceDescriptor = buildExportSignatureDescriptor(checker, sourceSymbol, sourceFile);
    let targetDescriptor = buildExportSignatureDescriptor(checker, targetSymbol, targetFile);
    let differences = diffExportSignatures(sourceDescriptor, targetDescriptor);

    if (differences.length === 0) {
      matchedExportCount++;
      continue;
    }

    mismatchedExportCount++;
    if (mismatches.length < 80) {
      mismatches.push({
        exportName,
        targetExportName: targetSymbol.name,
        differences,
        source: sourceDescriptor,
        target: targetDescriptor
      });
    }
  }

  let parityRatio = comparedExportCount === 0
    ? 1
    : Number((matchedExportCount / comparedExportCount).toFixed(4));

  return {
    ...entry,
    sourceEntrypoint: path.relative(REPO_ROOT, sourceEntrypoint),
    targetEntrypoint: path.relative(REPO_ROOT, targetEntrypoint),
    sourceExportCount: sourceExports.byName.size,
    comparedExportCount,
    matchedExportCount,
    mismatchedExportCount,
    missingInTargetCount: missingInTargetExports.length,
    parityRatio,
    missingInTargetExports: missingInTargetExports.sort(),
    mismatches,
    truncatedMismatchCount: Math.max(0, mismatchedExportCount - mismatches.length),
    error: null
  };
}

function buildApiSignatureReport(entries) {
  let program = buildSignatureProgram(entries);
  if (!program) {
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        trackedPackages: entries.length,
        comparedPackages: 0,
        erroredPackages: entries.length,
        fullyMatchedPackages: 0,
        sourceExportTotal: 0,
        comparedExportTotal: 0,
        matchedExportTotal: 0,
        mismatchedExportTotal: 0,
        missingInTargetTotal: 0,
        parityCoverage: 0
      },
      packages: entries.map((entry) => ({
        ...entry,
        sourceEntrypoint: null,
        targetEntrypoint: null,
        sourceExportCount: 0,
        comparedExportCount: 0,
        matchedExportCount: 0,
        mismatchedExportCount: 0,
        missingInTargetCount: 0,
        parityRatio: 0,
        missingInTargetExports: [],
        mismatches: [],
        truncatedMismatchCount: 0,
        error: 'Unable to create TypeScript program for signature comparison'
      }))
    };
  }

  let checker = program.getTypeChecker();
  let packageReports = entries.map((entry) => comparePackageApiSignatures(entry, program, checker));
  let comparedPackages = packageReports.filter((report) => !report.error);
  let erroredPackages = packageReports.filter((report) => report.error);
  let sourceExportTotal = comparedPackages.reduce((sum, report) => sum + report.sourceExportCount, 0);
  let comparedExportTotal = comparedPackages.reduce((sum, report) => sum + report.comparedExportCount, 0);
  let matchedExportTotal = comparedPackages.reduce((sum, report) => sum + report.matchedExportCount, 0);
  let mismatchedExportTotal = comparedPackages.reduce((sum, report) => sum + report.mismatchedExportCount, 0);
  let missingInTargetTotal = comparedPackages.reduce((sum, report) => sum + report.missingInTargetCount, 0);
  let fullyMatchedPackages = comparedPackages.filter((report) => report.mismatchedExportCount === 0 && report.missingInTargetCount === 0).length;
  let parityCoverage = comparedExportTotal === 0
    ? 1
    : Number((matchedExportTotal / comparedExportTotal).toFixed(4));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      trackedPackages: entries.length,
      comparedPackages: comparedPackages.length,
      erroredPackages: erroredPackages.length,
      fullyMatchedPackages,
      sourceExportTotal,
      comparedExportTotal,
      matchedExportTotal,
      mismatchedExportTotal,
      missingInTargetTotal,
      parityCoverage
    },
    packages: packageReports.sort((a, b) => {
      if (a.error && !b.error) {
        return -1;
      }
      if (!a.error && b.error) {
        return 1;
      }
      return b.mismatchedExportCount - a.mismatchedExportCount || b.missingInTargetCount - a.missingInTargetCount || a.sourcePackage.localeCompare(b.sourcePackage);
    })
  };
}

function buildApiSignatureMarkdown(report) {
  let lines = [];
  lines.push('# Vue API Signature Parity Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`* Tracked packages: ${report.summary.trackedPackages}`);
  lines.push(`* Compared packages: ${report.summary.comparedPackages}`);
  lines.push(`* Errored packages: ${report.summary.erroredPackages}`);
  lines.push(`* Fully matched packages: ${report.summary.fullyMatchedPackages}`);
  lines.push(`* Source exports inspected: ${report.summary.sourceExportTotal}`);
  lines.push(`* Common exports compared: ${report.summary.comparedExportTotal}`);
  lines.push(`* Matched signatures: ${report.summary.matchedExportTotal}`);
  lines.push(`* Mismatched signatures: ${report.summary.mismatchedExportTotal}`);
  lines.push(`* Missing in target during signature scan: ${report.summary.missingInTargetTotal}`);
  lines.push(`* Signature coverage ratio: ${(report.summary.parityCoverage * 100).toFixed(2)}%`);
  lines.push('');
  lines.push('## Package gaps');
  lines.push('');
  lines.push('| Source | Target | Status | Compared exports | Mismatched | Missing in target | Coverage |');
  lines.push('| --- | --- | --- | ---: | ---: | ---: | ---: |');

  for (let pkg of report.packages) {
    let status = pkg.error ? `error: ${pkg.error}` : (pkg.mismatchedExportCount === 0 && pkg.missingInTargetCount === 0 ? 'ok' : 'mismatch');
    let coverage = pkg.error ? '-' : `${(pkg.parityRatio * 100).toFixed(1)}%`;
    lines.push(`| \`${pkg.sourcePackage}\` | \`${pkg.targetPackage}\` | ${status} | ${pkg.comparedExportCount} | ${pkg.mismatchedExportCount} | ${pkg.missingInTargetCount} | ${coverage} |`);
  }

  lines.push('');
  lines.push('## Largest signature gaps');
  lines.push('');
  for (let pkg of report.packages.filter((item) => !item.error && item.mismatchedExportCount > 0).slice(0, 20)) {
    lines.push(`### ${pkg.sourcePackage} -> ${pkg.targetPackage}`);
    lines.push('');
    lines.push(`* Source entry: \`${pkg.sourceEntrypoint}\``);
    lines.push(`* Target entry: \`${pkg.targetEntrypoint}\``);
    lines.push(`* Compared exports: ${pkg.comparedExportCount}`);
    lines.push(`* Mismatched signatures: ${pkg.mismatchedExportCount}`);
    lines.push(`* Missing in target: ${pkg.missingInTargetCount}`);
    let mismatchPreview = pkg.mismatches.slice(0, 25).map((item) => `${item.exportName} [${item.differences.join(', ')}]`);
    lines.push(`* Example mismatches: \`${mismatchPreview.join('`, `')}\`${pkg.mismatchedExportCount > 25 ? ' ...' : ''}`);
    lines.push('');
  }

  return lines.join('\n');
}

function readPackageJsonAt(relativePackagePath) {
  let packageJsonPath = path.join(REPO_ROOT, relativePackagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  return readJson(packageJsonPath);
}

function getTrackedSourceDependencyMap(entries) {
  let trackedSources = new Set(entries.map(entry => entry.sourcePackage));
  let dependencyMap = new Map();

  for (let entry of entries) {
    let pkgJson = readPackageJsonAt(entry.sourcePath);
    let dependencies = new Set();

    if (pkgJson) {
      for (let section of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
        let sectionDeps = pkgJson[section] ?? {};
        for (let dependencyName of Object.keys(sectionDeps)) {
          if (trackedSources.has(dependencyName)) {
            dependencies.add(dependencyName);
          }
        }
      }
    }

    dependencyMap.set(entry.sourcePackage, [...dependencies].sort());
  }

  return dependencyMap;
}

function getReverseDependentCounts(dependencyMap) {
  let reverseCounts = new Map();
  for (let packageName of dependencyMap.keys()) {
    reverseCounts.set(packageName, 0);
  }

  for (let dependencies of dependencyMap.values()) {
    for (let dependencyName of dependencies) {
      reverseCounts.set(dependencyName, (reverseCounts.get(dependencyName) ?? 0) + 1);
    }
  }

  return reverseCounts;
}

function getDependencyDepths(dependencyMap) {
  let cache = new Map();
  let active = new Set();

  let walk = (packageName) => {
    if (cache.has(packageName)) {
      return cache.get(packageName);
    }

    if (active.has(packageName)) {
      return 0;
    }

    active.add(packageName);
    let dependencies = dependencyMap.get(packageName) ?? [];
    let depth = dependencies.length === 0
      ? 0
      : 1 + Math.max(...dependencies.map(dependencyName => walk(dependencyName)));
    active.delete(packageName);
    cache.set(packageName, depth);
    return depth;
  };

  for (let packageName of dependencyMap.keys()) {
    walk(packageName);
  }

  return cache;
}

function getPackageCriticalityWeight(sourcePackage) {
  if (sourcePackage === 'react-aria-components') {
    return 3.2;
  }

  if (sourcePackage === 'react-aria' || sourcePackage === 'react-stately') {
    return 2.6;
  }

  if (sourcePackage.startsWith('@react-aria/') || sourcePackage.startsWith('@react-stately/')) {
    return 1.9;
  }

  if (sourcePackage.startsWith('@react-spectrum/')) {
    return 1.4;
  }

  return 1;
}

function buildApiPriorityReport(entries, apiReport) {
  let dependencyMap = getTrackedSourceDependencyMap(entries);
  let reverseDependentCounts = getReverseDependentCounts(dependencyMap);
  let dependencyDepths = getDependencyDepths(dependencyMap);
  let reportBySourcePackage = new Map(apiReport.packages.map(pkg => [pkg.sourcePackage, pkg]));
  let priorityPackages = [];

  for (let entry of entries) {
    let packageReport = reportBySourcePackage.get(entry.sourcePackage);
    if (!packageReport || packageReport.error) {
      continue;
    }

    if (packageReport.missingExports.length === 0) {
      continue;
    }

    let reverseDependents = reverseDependentCounts.get(entry.sourcePackage) ?? 0;
    let dependencyDepth = dependencyDepths.get(entry.sourcePackage) ?? 0;
    let criticalityWeight = getPackageCriticalityWeight(entry.sourcePackage);
    let missingExports = packageReport.missingExports.length;

    let priorityScore = Number((
      missingExports * criticalityWeight +
      reverseDependents * 4 +
      dependencyDepth * 2.5 +
      Math.max(0, 100 - (packageReport.parityRatio * 100)) * 0.15
    ).toFixed(2));

    priorityPackages.push({
      sourcePackage: entry.sourcePackage,
      targetPackage: entry.targetPackage,
      missingExports,
      sourceExportCount: packageReport.sourceExportCount,
      coveragePercent: Number((packageReport.parityRatio * 100).toFixed(2)),
      reverseDependents,
      dependencyDepth,
      criticalityWeight,
      priorityScore
    });
  }

  priorityPackages.sort((a, b) => b.priorityScore - a.priorityScore || b.missingExports - a.missingExports || a.sourcePackage.localeCompare(b.sourcePackage));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      trackedPackages: entries.length,
      packagesWithGaps: priorityPackages.length,
      highestPriorityPackage: priorityPackages[0]?.sourcePackage ?? null,
      highestPriorityScore: priorityPackages[0]?.priorityScore ?? 0
    },
    packages: priorityPackages
  };
}

function buildApiPriorityMarkdown(priorityReport) {
  let lines = [];
  lines.push('# Vue API Parity Priority');
  lines.push('');
  lines.push(`Generated: ${priorityReport.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`* Tracked packages: ${priorityReport.summary.trackedPackages}`);
  lines.push(`* Packages with API gaps: ${priorityReport.summary.packagesWithGaps}`);
  lines.push(`* Highest priority package: ${priorityReport.summary.highestPriorityPackage ?? 'n/a'}`);
  lines.push(`* Highest priority score: ${priorityReport.summary.highestPriorityScore}`);
  lines.push('');
  lines.push('## Ranked packages');
  lines.push('');
  lines.push('| Rank | Source | Target | Missing | Coverage | Reverse deps | Depth | Score |');
  lines.push('| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |');

  for (let [index, pkg] of priorityReport.packages.entries()) {
    lines.push(`| ${index + 1} | \`${pkg.sourcePackage}\` | \`${pkg.targetPackage}\` | ${pkg.missingExports} | ${pkg.coveragePercent.toFixed(2)}% | ${pkg.reverseDependents} | ${pkg.dependencyDepth} | ${pkg.priorityScore.toFixed(2)} |`);
  }

  lines.push('');
  lines.push('## Top execution tranche');
  lines.push('');
  for (let pkg of priorityReport.packages.slice(0, 12)) {
    lines.push(`* \`${pkg.sourcePackage}\` -> \`${pkg.targetPackage}\` (score: ${pkg.priorityScore.toFixed(2)}, missing: ${pkg.missingExports}, reverse deps: ${pkg.reverseDependents}, depth: ${pkg.dependencyDepth})`);
  }
  lines.push('');

  return lines.join('\n');
}

function writeApiPriorityReport(priorityReport) {
  fs.writeFileSync(API_PRIORITY_JSON, JSON.stringify(priorityReport, null, 2));
  fs.writeFileSync(API_PRIORITY_MD, `${buildApiPriorityMarkdown(priorityReport)}\n`);
}

function printApiPrioritySummary(priorityReport) {
  console.log(`Tracked packages: ${priorityReport.summary.trackedPackages}`);
  console.log(`Packages with API gaps: ${priorityReport.summary.packagesWithGaps}`);
  console.log(`Highest priority package: ${priorityReport.summary.highestPriorityPackage ?? 'n/a'}`);
  console.log(`Highest priority score: ${priorityReport.summary.highestPriorityScore}`);
}

function writeApiReport(report) {
  fs.writeFileSync(API_REPORT_JSON, JSON.stringify(report, null, 2));
  fs.writeFileSync(API_REPORT_MD, `${buildApiParityMarkdown(report)}\n`);
}

function writeApiSignatureReport(report) {
  fs.writeFileSync(API_SIGNATURE_REPORT_JSON, JSON.stringify(report, null, 2));
  fs.writeFileSync(API_SIGNATURE_REPORT_MD, `${buildApiSignatureMarkdown(report)}\n`);
}

function printApiSummary(report) {
  console.log(`Tracked packages: ${report.summary.trackedPackages}`);
  console.log(`Compared packages: ${report.summary.comparedPackages}`);
  console.log(`Errored packages: ${report.summary.erroredPackages}`);
  console.log(`Fully matched packages: ${report.summary.fullyMatchedPackages}`);
  console.log(`Source exports inspected: ${report.summary.sourceExportTotal}`);
  console.log(`Missing exports: ${report.summary.missingExportTotal}`);
  console.log(`Coverage ratio: ${(report.summary.parityCoverage * 100).toFixed(2)}%`);
}

function printApiSignatureSummary(report) {
  console.log(`Tracked packages: ${report.summary.trackedPackages}`);
  console.log(`Compared packages: ${report.summary.comparedPackages}`);
  console.log(`Errored packages: ${report.summary.erroredPackages}`);
  console.log(`Fully matched packages: ${report.summary.fullyMatchedPackages}`);
  console.log(`Source exports inspected: ${report.summary.sourceExportTotal}`);
  console.log(`Common exports compared: ${report.summary.comparedExportTotal}`);
  console.log(`Matched signatures: ${report.summary.matchedExportTotal}`);
  console.log(`Mismatched signatures: ${report.summary.mismatchedExportTotal}`);
  console.log(`Missing in target during signature scan: ${report.summary.missingInTargetTotal}`);
  console.log(`Signature coverage ratio: ${(report.summary.parityCoverage * 100).toFixed(2)}%`);
}

function assertApiParity(report, maxMissing) {
  let packagesWithErrors = report.packages.filter(pkg => pkg.error);
  let packagesExceedingThreshold = report.packages.filter(pkg => !pkg.error && pkg.missingExports.length > maxMissing);

  if (packagesWithErrors.length > 0 || packagesExceedingThreshold.length > 0) {
    console.error('API parity assertion failed.');
    if (packagesWithErrors.length > 0) {
      console.error(`Packages with parity analysis errors: ${packagesWithErrors.length}`);
      for (let pkg of packagesWithErrors.slice(0, 20)) {
        console.error(`- ${pkg.sourcePackage}: ${pkg.error}`);
      }
    }
    if (packagesExceedingThreshold.length > 0) {
      console.error(`Packages with missing exports above threshold (${maxMissing}): ${packagesExceedingThreshold.length}`);
      for (let pkg of packagesExceedingThreshold.slice(0, 20)) {
        console.error(`- ${pkg.sourcePackage}: ${pkg.missingExports.length} missing`);
      }
    }
    process.exitCode = 1;
    return;
  }

  console.log(`API parity assertion passed with maxMissing=${maxMissing}.`);
}

function assertApiSignatureParity(report, maxMismatches) {
  let packagesWithErrors = report.packages.filter((pkg) => pkg.error);
  let mismatchTotal = report.summary.mismatchedExportTotal + report.summary.missingInTargetTotal;

  if (packagesWithErrors.length > 0 || mismatchTotal > maxMismatches) {
    console.error('API signature parity assertion failed.');
    if (packagesWithErrors.length > 0) {
      console.error(`Packages with signature analysis errors: ${packagesWithErrors.length}`);
      for (let pkg of packagesWithErrors.slice(0, 20)) {
        console.error(`- ${pkg.sourcePackage}: ${pkg.error}`);
      }
    }
    if (mismatchTotal > maxMismatches) {
      console.error(`Total signature mismatches above threshold (${maxMismatches}): ${mismatchTotal}`);
      for (let pkg of report.packages.filter((item) => !item.error && (item.mismatchedExportCount > 0 || item.missingInTargetCount > 0)).slice(0, 20)) {
        console.error(`- ${pkg.sourcePackage}: mismatched=${pkg.mismatchedExportCount}, missingInTarget=${pkg.missingInTargetCount}`);
      }
    }
    process.exitCode = 1;
    return;
  }

  console.log(`API signature parity assertion passed with maxMismatches=${maxMismatches}.`);
}

function runApiReport({write}) {
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);
  let report = buildApiParityReport(entries);

  if (write) {
    writeApiReport(report);
    console.log(`Wrote ${path.relative(REPO_ROOT, API_REPORT_JSON)} and ${path.relative(REPO_ROOT, API_REPORT_MD)}.`);
  }

  printApiSummary(report);
}

function runApiSignatureReport({write}) {
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);
  let report = buildApiSignatureReport(entries);

  if (write) {
    writeApiSignatureReport(report);
    console.log(`Wrote ${path.relative(REPO_ROOT, API_SIGNATURE_REPORT_JSON)} and ${path.relative(REPO_ROOT, API_SIGNATURE_REPORT_MD)}.`);
  }

  printApiSignatureSummary(report);
}

function runApiSignatureAssert({write, maxMismatches}) {
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);
  let report = buildApiSignatureReport(entries);

  if (write) {
    writeApiSignatureReport(report);
    console.log(`Wrote ${path.relative(REPO_ROOT, API_SIGNATURE_REPORT_JSON)} and ${path.relative(REPO_ROOT, API_SIGNATURE_REPORT_MD)}.`);
  }

  printApiSignatureSummary(report);
  assertApiSignatureParity(report, maxMismatches);
}

function runApiAssert({write, maxMissing}) {
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);
  let report = buildApiParityReport(entries);

  if (write) {
    writeApiReport(report);
    console.log(`Wrote ${path.relative(REPO_ROOT, API_REPORT_JSON)} and ${path.relative(REPO_ROOT, API_REPORT_MD)}.`);
  }

  printApiSummary(report);
  assertApiParity(report, maxMissing);
}

function runApiPriority({write}) {
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);
  let apiReport = buildApiParityReport(entries);
  let priorityReport = buildApiPriorityReport(entries, apiReport);

  if (write) {
    writeApiPriorityReport(priorityReport);
    console.log(`Wrote ${path.relative(REPO_ROOT, API_PRIORITY_JSON)} and ${path.relative(REPO_ROOT, API_PRIORITY_MD)}.`);
  }

  printApiPrioritySummary(priorityReport);
}

function main() {
  let {command, write, maxMissing, maxMismatches} = parseArgs(process.argv.slice(2));

  if (command === 'api-report') {
    runApiReport({write});
    return;
  }

  if (command === 'api-assert') {
    runApiAssert({write, maxMissing});
    return;
  }

  if (command === 'api-signature-report') {
    runApiSignatureReport({write});
    return;
  }

  if (command === 'api-signature-assert') {
    runApiSignatureAssert({write, maxMismatches});
    return;
  }

  if (command === 'api-priority') {
    runApiPriority({write});
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error('Usage: node scripts/vue-parity-pipeline.mjs [api-report|api-assert|api-signature-report|api-signature-assert|api-priority] [--write] [--max-missing N] [--max-mismatches N]');
  process.exitCode = 1;
}

main();
