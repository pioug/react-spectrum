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

function parseArgs(args) {
  let command = args[0] ?? 'api-report';
  let write = args.includes('--write');
  let maxMissing = 0;
  let maxMissingIndex = args.indexOf('--max-missing');
  if (maxMissingIndex !== -1 && args[maxMissingIndex + 1]) {
    maxMissing = Number(args[maxMissingIndex + 1]);
    if (!Number.isFinite(maxMissing) || maxMissing < 0) {
      throw new Error(`Invalid --max-missing value: ${args[maxMissingIndex + 1]}`);
    }
  }
  return {command, write, maxMissing};
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

function writeApiReport(report) {
  fs.writeFileSync(API_REPORT_JSON, JSON.stringify(report, null, 2));
  fs.writeFileSync(API_REPORT_MD, `${buildApiParityMarkdown(report)}\n`);
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

function main() {
  let {command, write, maxMissing} = parseArgs(process.argv.slice(2));

  if (command === 'api-report') {
    runApiReport({write});
    return;
  }

  if (command === 'api-assert') {
    runApiAssert({write, maxMissing});
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error('Usage: node scripts/vue-parity-pipeline.mjs [api-report|api-assert] [--write] [--max-missing N]');
  process.exitCode = 1;
}

main();
