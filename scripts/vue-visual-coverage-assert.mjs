import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const VUE_SPECTRUM_ROOT = path.join(REPO_ROOT, 'packages', '@vue-spectrum');
const FIXTURE_CONFIG_PATH = path.join(REPO_ROOT, 'migration', 'vue-visual-parity-fixtures.json');

const EXCLUDED_PACKAGES = new Set([
  'components',
  's2',
  'story-utils',
  'style-macro-s1',
  'test-utils',
  'utils'
]);

const PACKAGE_FIXTURE_MAP = {
  accordion: ['pkg-accordion'],
  actionbar: ['pkg-actionbar'],
  actiongroup: ['pkg-actiongroup'],
  autocomplete: ['pkg-autocomplete'],
  avatar: ['pkg-avatar'],
  badge: ['badge-positive'],
  breadcrumbs: ['pkg-breadcrumbs'],
  button: ['button-default'],
  buttongroup: ['pkg-buttongroup'],
  calendar: ['pkg-calendar'],
  card: ['card-selected'],
  checkbox: ['pkg-checkbox'],
  color: ['pkg-color'],
  combobox: ['pkg-combobox'],
  contextualhelp: ['pkg-contextualhelp'],
  datepicker: ['pkg-datepicker'],
  dialog: ['pkg-dialog'],
  divider: ['pkg-divider'],
  dnd: ['pkg-dnd'],
  dropzone: ['pkg-dropzone'],
  filetrigger: ['pkg-filetrigger'],
  form: ['pkg-form'],
  icon: ['icon-default'],
  illustratedmessage: ['pkg-illustratedmessage'],
  image: ['pkg-image'],
  inlinealert: ['pkg-inlinealert'],
  label: ['pkg-label'],
  labeledvalue: ['pkg-labeledvalue'],
  layout: ['pkg-layout'],
  link: ['pkg-link'],
  list: ['pkg-list'],
  listbox: ['listbox-selected'],
  menu: ['pkg-menu'],
  meter: ['pkg-meter'],
  numberfield: ['pkg-numberfield'],
  overlays: ['pkg-overlays'],
  picker: ['pkg-picker'],
  progress: ['pkg-progress'],
  provider: ['theme-default-cluster', 'theme-light-cluster', 'theme-dark-cluster', 'theme-express-cluster'],
  radio: ['pkg-radio'],
  searchfield: ['pkg-searchfield'],
  slider: ['pkg-slider'],
  statuslight: ['pkg-statuslight'],
  steplist: ['pkg-steplist'],
  switch: ['switch-default'],
  table: ['table-default'],
  tabs: ['tabs-default'],
  tag: ['pkg-tag'],
  text: ['text-detail'],
  textfield: ['textfield-default'],
  'theme-dark': ['theme-dark-cluster'],
  'theme-default': ['theme-default-cluster'],
  'theme-express': ['theme-express-cluster'],
  'theme-light': ['theme-light-cluster'],
  toast: ['pkg-toast'],
  tooltip: ['pkg-tooltip'],
  tree: ['pkg-tree'],
  view: ['view-bordered'],
  well: ['pkg-well']
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getVueSpectrumPackages() {
  if (!fs.existsSync(VUE_SPECTRUM_ROOT)) {
    throw new Error(`Missing @vue-spectrum package root: ${path.relative(REPO_ROOT, VUE_SPECTRUM_ROOT)}`);
  }

  let packageNames = [];
  for (let entry of fs.readdirSync(VUE_SPECTRUM_ROOT).sort()) {
    let packageJsonPath = path.join(VUE_SPECTRUM_ROOT, entry, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    packageNames.push(entry);
  }

  return packageNames;
}

function collectFixtureIds() {
  let config = readJson(FIXTURE_CONFIG_PATH);
  if (!Array.isArray(config.fixtures)) {
    throw new Error(`Invalid fixtures config at ${path.relative(REPO_ROOT, FIXTURE_CONFIG_PATH)}: expected "fixtures" array.`);
  }

  return new Set(config.fixtures.map((fixture) => fixture.id));
}

function assertCoverage() {
  let fixtureIds = collectFixtureIds();
  let packageNames = getVueSpectrumPackages();
  let trackedPackages = packageNames.filter((pkg) => !EXCLUDED_PACKAGES.has(pkg));

  let packagesMissingMap = [];
  let fixtureIdsMissing = [];
  let staleMappings = [];
  let coveredPackages = 0;

  for (let packageName of trackedPackages) {
    let mappedFixtureIds = PACKAGE_FIXTURE_MAP[packageName];
    if (!Array.isArray(mappedFixtureIds) || mappedFixtureIds.length === 0) {
      packagesMissingMap.push(packageName);
      continue;
    }

    let missingForPackage = mappedFixtureIds.filter((fixtureId) => !fixtureIds.has(fixtureId));
    if (missingForPackage.length > 0) {
      fixtureIdsMissing.push({
        packageName,
        missingFixtureIds: missingForPackage
      });
      continue;
    }

    coveredPackages++;
  }

  let knownPackages = new Set(packageNames);
  for (let mappedPackage of Object.keys(PACKAGE_FIXTURE_MAP).sort()) {
    if (!knownPackages.has(mappedPackage)) {
      staleMappings.push(mappedPackage);
    }
  }

  console.log(`Vue UI packages tracked for visual coverage: ${trackedPackages.length}`);
  console.log(`Covered by fixture map and config: ${coveredPackages}`);
  console.log(`Fixtures configured: ${fixtureIds.size}`);

  if (packagesMissingMap.length > 0) {
    console.error('\nPackages missing fixture mapping:');
    for (let packageName of packagesMissingMap) {
      console.error(`- @vue-spectrum/${packageName}`);
    }
  }

  if (fixtureIdsMissing.length > 0) {
    console.error('\nPackages with missing fixture ids:');
    for (let entry of fixtureIdsMissing) {
      console.error(`- @vue-spectrum/${entry.packageName}: ${entry.missingFixtureIds.join(', ')}`);
    }
  }

  if (staleMappings.length > 0) {
    console.error('\nFixture mappings for missing packages:');
    for (let packageName of staleMappings) {
      console.error(`- @vue-spectrum/${packageName}`);
    }
  }

  if (packagesMissingMap.length > 0 || fixtureIdsMissing.length > 0 || staleMappings.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('\nVue visual fixture coverage assertion passed.');
}

assertCoverage();
