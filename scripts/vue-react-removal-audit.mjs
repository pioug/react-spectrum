import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const AUDIT_JSON_PATH = path.join(REPO_ROOT, 'migration', 'vue-react-removal-audit.json');
const AUDIT_MD_PATH = path.join(REPO_ROOT, 'migration', 'VUE_REACT_REMOVAL_AUDIT.md');

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.vue']);
const SKIP_DIRS = new Set(['node_modules', 'dist']);

const REACT_RUNTIME_PACKAGE_PREFIXES = [
  '@react-aria/',
  '@react-spectrum/',
  '@react-stately/'
];

const REACT_CORE_RUNTIME_PACKAGES = new Set([
  'react',
  'react-dom',
  'react-frame-component',
  'react-test-renderer'
]);

const REACT_TYPE_PACKAGE_PREFIX = '@react-types/';

function parseArgs(args) {
  return {
    command: args[0] ?? 'report',
    write: args.includes('--write')
  };
}

function toRepoRelative(filePath) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
}

function discoverVuePackageDirs() {
  let packagesRoot = path.join(REPO_ROOT, 'packages');
  let result = [];

  for (let entry of fs.readdirSync(packagesRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }

    let groupDir = path.join(packagesRoot, entry.name);

    if (entry.name.startsWith('@vue-')) {
      for (let scopedEntry of fs.readdirSync(groupDir, {withFileTypes: true})) {
        if (!scopedEntry.isDirectory()) {
          continue;
        }

        let packageDir = path.join(groupDir, scopedEntry.name);
        if (fs.existsSync(path.join(packageDir, 'package.json'))) {
          result.push(packageDir);
        }
      }
      continue;
    }

    if (entry.name.startsWith('vue-') && fs.existsSync(path.join(groupDir, 'package.json'))) {
      result.push(groupDir);
    }
  }

  return result.sort();
}

function walkFiles(dir, callback) {
  for (let entry of fs.readdirSync(dir, {withFileTypes: true})) {
    let fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walkFiles(fullPath, callback);
      }
      continue;
    }

    callback(fullPath);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isReactRuntimePackage(specifier) {
  if (REACT_CORE_RUNTIME_PACKAGES.has(specifier)) {
    return true;
  }

  return REACT_RUNTIME_PACKAGE_PREFIXES.some(prefix => specifier.startsWith(prefix));
}

function isReactTypePackage(specifier) {
  return specifier.startsWith(REACT_TYPE_PACKAGE_PREFIX);
}

function collectSourceReferences() {
  let packageDirs = discoverVuePackageDirs();
  let files = [];

  for (let packageDir of packageDirs) {
    walkFiles(packageDir, (fullPath) => {
      if (SOURCE_EXTENSIONS.has(path.extname(fullPath))) {
        files.push(toRepoRelative(fullPath));
      }
    });
  }

  files.sort();

  let runtimeImports = [];
  let typeImports = [];
  let exportTypeRefs = [];
  let coreReactRuntimeImports = [];
  let coreReactTypeImports = [];

  for (let file of files) {
    let content = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
    let lines = content.split(/\r?\n/u);

    for (let index = 0; index < lines.length; index++) {
      let line = lines[index];
      let lineNumber = index + 1;

      let importTypeMatch = line.match(/^\s*import\s+type\b.*from\s+['"]([^'"]+)['"]/u);
      if (importTypeMatch) {
        let specifier = importTypeMatch[1];
        if (specifier.startsWith('@react-')) {
          typeImports.push({file, line: lineNumber, specifier});
        }

        if (specifier === 'react' || specifier === 'react-dom') {
          coreReactTypeImports.push({file, line: lineNumber, specifier});
        }
        continue;
      }

      let importMatch = line.match(/^\s*import\s+.+from\s+['"]([^'"]+)['"]/u);
      if (importMatch) {
        let specifier = importMatch[1];
        if (specifier.startsWith('@react-')) {
          runtimeImports.push({file, line: lineNumber, specifier});
        }

        if (specifier === 'react' || specifier === 'react-dom') {
          coreReactRuntimeImports.push({file, line: lineNumber, specifier});
        }
        continue;
      }

      let exportTypeMatch = line.match(/^\s*export\s+type\b.*from\s+['"]([^'"]+)['"]/u);
      if (exportTypeMatch) {
        let specifier = exportTypeMatch[1];
        if (specifier.startsWith('@react-')) {
          exportTypeRefs.push({file, line: lineNumber, specifier});
        }

        if (specifier === 'react' || specifier === 'react-dom') {
          coreReactTypeImports.push({file, line: lineNumber, specifier});
        }
      }
    }
  }

  let filesWithReactReferences = new Set([
    ...runtimeImports.map(item => item.file),
    ...typeImports.map(item => item.file),
    ...exportTypeRefs.map(item => item.file),
    ...coreReactRuntimeImports.map(item => item.file),
    ...coreReactTypeImports.map(item => item.file)
  ]);

  return {
    filesScanned: files.length,
    filesWithReactReferences: Array.from(filesWithReactReferences).sort(),
    runtimeImports,
    typeImports,
    exportTypeRefs,
    coreReactRuntimeImports,
    coreReactTypeImports
  };
}

function collectPackageReferences() {
  let packageFiles = discoverVuePackageDirs()
    .map(packageDir => toRepoRelative(path.join(packageDir, 'package.json')))
    .sort();

  let runtimeDeps = [];
  let typeDeps = [];
  let otherReactDeps = [];

  for (let file of packageFiles) {
    let packageJson = readJson(path.join(REPO_ROOT, file));
    for (let section of ['dependencies', 'peerDependencies', 'devDependencies', 'optionalDependencies']) {
      let deps = packageJson[section];
      if (!deps || typeof deps !== 'object') {
        continue;
      }

      for (let [name, version] of Object.entries(deps)) {
        if (!name.startsWith('@react-') && !REACT_CORE_RUNTIME_PACKAGES.has(name)) {
          continue;
        }

        let entry = {
          file,
          packageName: packageJson.name,
          section,
          name,
          version
        };

        if (isReactRuntimePackage(name)) {
          runtimeDeps.push(entry);
          continue;
        }

        if (isReactTypePackage(name)) {
          typeDeps.push(entry);
          continue;
        }

        otherReactDeps.push(entry);
      }
    }
  }

  let packagesWithReactDependencies = new Set([
    ...runtimeDeps.map(item => item.packageName),
    ...typeDeps.map(item => item.packageName),
    ...otherReactDeps.map(item => item.packageName)
  ]);

  return {
    packageFilesScanned: packageFiles.length,
    packagesWithReactDependencies: Array.from(packagesWithReactDependencies).sort(),
    runtimeDeps,
    typeDeps,
    otherReactDeps
  };
}

function buildAudit() {
  let source = collectSourceReferences();
  let packages = collectPackageReferences();

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      filesScanned: source.filesScanned,
      filesWithReactReferences: source.filesWithReactReferences.length,
      packageFilesScanned: packages.packageFilesScanned,
      packagesWithReactDependencies: packages.packagesWithReactDependencies.length,
      runtimeSourceReferences: source.runtimeImports.length + source.coreReactRuntimeImports.length,
      typeSourceReferences: source.typeImports.length + source.exportTypeRefs.length + source.coreReactTypeImports.length,
      runtimePackageDependencies: packages.runtimeDeps.length,
      typePackageDependencies: packages.typeDeps.length,
      otherReactPackageDependencies: packages.otherReactDeps.length
    },
    source,
    packages
  };
}

function buildMarkdown(audit) {
  let lines = [];
  lines.push('# Vue React Removal Audit');
  lines.push('');
  lines.push(`Generated: ${audit.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Source files scanned: ${audit.summary.filesScanned}`);
  lines.push(`- Source files with React references: ${audit.summary.filesWithReactReferences}`);
  lines.push(`- Package manifests scanned: ${audit.summary.packageFilesScanned}`);
  lines.push(`- Package manifests with React dependencies: ${audit.summary.packagesWithReactDependencies}`);
  lines.push(`- Runtime source references: ${audit.summary.runtimeSourceReferences}`);
  lines.push(`- Type-only source references: ${audit.summary.typeSourceReferences}`);
  lines.push(`- Runtime package dependencies: ${audit.summary.runtimePackageDependencies}`);
  lines.push(`- Type-only package dependencies: ${audit.summary.typePackageDependencies}`);
  lines.push(`- Other React package dependencies: ${audit.summary.otherReactPackageDependencies}`);
  lines.push('');

  lines.push('## Runtime Source References');
  lines.push('');
  if (audit.summary.runtimeSourceReferences === 0) {
    lines.push('- none');
  } else {
    for (let ref of [...audit.source.runtimeImports, ...audit.source.coreReactRuntimeImports]) {
      lines.push(`- \`${ref.file}:${ref.line}\` -> \`${ref.specifier}\``);
    }
  }
  lines.push('');

  lines.push('## Runtime Package Dependencies');
  lines.push('');
  if (audit.summary.runtimePackageDependencies === 0) {
    lines.push('- none');
  } else {
    for (let dep of audit.packages.runtimeDeps) {
      lines.push(`- \`${dep.packageName}\` (\`${dep.section}\`): \`${dep.name}@${dep.version}\` in \`${dep.file}\``);
    }
  }
  lines.push('');

  return lines.join('\n');
}

function writeAudit(audit) {
  fs.writeFileSync(AUDIT_JSON_PATH, JSON.stringify(audit, null, 2) + '\n');
  fs.writeFileSync(AUDIT_MD_PATH, buildMarkdown(audit));
}

function printSummary(audit) {
  console.log(`Source files with React references: ${audit.summary.filesWithReactReferences}/${audit.summary.filesScanned}`);
  console.log(`Package manifests with React dependencies: ${audit.summary.packagesWithReactDependencies}/${audit.summary.packageFilesScanned}`);
  console.log(`Runtime source references: ${audit.summary.runtimeSourceReferences}`);
  console.log(`Type-only source references: ${audit.summary.typeSourceReferences}`);
  console.log(`Runtime package dependencies: ${audit.summary.runtimePackageDependencies}`);
  console.log(`Type-only package dependencies: ${audit.summary.typePackageDependencies}`);
  console.log(`Other React package dependencies: ${audit.summary.otherReactPackageDependencies}`);
}

function assertRuntimeClean(audit) {
  let violations = [];
  if (audit.summary.runtimeSourceReferences > 0) {
    violations.push(`runtime source references: ${audit.summary.runtimeSourceReferences}`);
  }
  if (audit.summary.runtimePackageDependencies > 0) {
    violations.push(`runtime package dependencies: ${audit.summary.runtimePackageDependencies}`);
  }
  if (audit.summary.otherReactPackageDependencies > 0) {
    violations.push(`other React package dependencies: ${audit.summary.otherReactPackageDependencies}`);
  }

  if (violations.length > 0) {
    console.error('Vue React runtime decoupling assertion failed:');
    for (let violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Vue React runtime decoupling assertion passed.');
}

function assertZeroReact(audit) {
  let violations = [];
  if (audit.summary.filesWithReactReferences > 0) {
    violations.push(`source files with React references: ${audit.summary.filesWithReactReferences}`);
  }
  if (audit.summary.packagesWithReactDependencies > 0) {
    violations.push(`package manifests with React dependencies: ${audit.summary.packagesWithReactDependencies}`);
  }

  if (violations.length > 0) {
    console.error('Vue full React removal assertion failed:');
    for (let violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Vue full React removal assertion passed.');
}

function main() {
  let {command, write} = parseArgs(process.argv.slice(2));
  let audit = buildAudit();

  if (command === 'report') {
    if (write) {
      writeAudit(audit);
      console.log(`Wrote ${path.relative(REPO_ROOT, AUDIT_JSON_PATH)}`);
      console.log(`Wrote ${path.relative(REPO_ROOT, AUDIT_MD_PATH)}`);
    }
    printSummary(audit);
    return;
  }

  if (command === 'assert-runtime') {
    if (write) {
      writeAudit(audit);
    }
    printSummary(audit);
    assertRuntimeClean(audit);
    return;
  }

  if (command === 'assert-zero') {
    if (write) {
      writeAudit(audit);
    }
    printSummary(audit);
    assertZeroReact(audit);
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error('Usage: node scripts/vue-react-removal-audit.mjs [report|assert-runtime|assert-zero] [--write]');
  process.exitCode = 1;
}

main();
