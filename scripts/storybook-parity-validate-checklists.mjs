#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const CHECKLIST_DIR = path.join(process.cwd(), 'storybook-parity', 'checklists');
const REQUIRED_HEADERS = [
  '## Scope',
  '## React Sources',
  '## Vue Sources',
  '## Gap List',
  '## Fixes Applied',
  '## Tests',
  '## Status'
];

function isChecklistFile(fileName) {
  if (!fileName.endsWith('.md')) {
    return false;
  }

  if (fileName === 'README.md' || fileName === '_TEMPLATE.md') {
    return false;
  }

  return true;
}

function main() {
  if (!fs.existsSync(CHECKLIST_DIR)) {
    throw new Error(`Checklist directory not found: ${CHECKLIST_DIR}`);
  }

  let files = fs.readdirSync(CHECKLIST_DIR).filter(isChecklistFile).sort();

  if (files.length === 0) {
    throw new Error('No parity checklist files found.');
  }

  let failures = [];

  for (let fileName of files) {
    let fullPath = path.join(CHECKLIST_DIR, fileName);
    let content = fs.readFileSync(fullPath, 'utf8');
    let missing = REQUIRED_HEADERS.filter((header) => !content.includes(header));

    if (missing.length > 0) {
      failures.push({fileName, missing});
    }
  }

  if (failures.length > 0) {
    for (let failure of failures) {
      console.error(`Checklist invalid: ${failure.fileName}`);
      for (let header of failure.missing) {
        console.error(`  Missing: ${header}`);
      }
    }
    process.exit(1);
  }

  console.log(`Validated ${files.length} checklist file(s).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
