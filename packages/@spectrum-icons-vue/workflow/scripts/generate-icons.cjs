#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const distDir = path.dirname(require.resolve('@adobe/react-spectrum-workflow/dist/index.js'));
const outputDir = path.resolve(__dirname, '..', 'src');

function toIdentifier(name) {
  return /^[0-9]/.test(name) ? `_${name}` : name;
}

function escapeTemplateLiteral(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

function parseSvgMarkup(markup, fileName) {
  let match = markup.match(/^<svg\s*([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) {
    throw new Error(`Unable to parse SVG output for ${fileName}`);
  }

  let attrs = {};
  let attrRegex = /([:@A-Za-z0-9_-]+)="([^"]*)"/g;
  let attrMatch = null;
  while ((attrMatch = attrRegex.exec(match[1])) !== null) {
    attrs[attrMatch[1]] = attrMatch[2];
  }

  return {
    attrs,
    innerHTML: match[2]
  };
}

function formatObjectLiteral(object) {
  let entries = Object.entries(object);
  if (entries.length === 0) {
    return '{}';
  }

  return `\n${entries.map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`).join(',\n')}\n`;
}

function generateIconFile(iconName, attrs, innerHTML) {
  let componentIdentifier = toIdentifier(iconName);
  let componentName = `VueWorkflow${componentIdentifier}`;
  let attributesLiteral = formatObjectLiteral(attrs);

  return `import {createWorkflowIcon} from './createIcon';

const svgAttributes = {${attributesLiteral}};
const svgInnerHTML = \`${escapeTemplateLiteral(innerHTML)}\`;

const ${componentIdentifier} = createWorkflowIcon('${componentName}', svgAttributes, svgInnerHTML);

export default ${componentIdentifier};
`;
}

function main() {
  fs.mkdirSync(outputDir, {recursive: true});

  let files = fs.readdirSync(distDir)
    .filter((file) => file.endsWith('.js'))
    .filter((file) => file !== 'index.js' && file !== 'util.js')
    .sort((a, b) => a.localeCompare(b));

  let indexExports = [];

  for (let file of files) {
    let iconName = path.basename(file, '.js');
    let iconModulePath = path.join(distDir, file);
    let iconModule = require(iconModulePath);
    let exportName = Object.keys(iconModule).find((key) => key.startsWith('A4u'));
    if (!exportName) {
      throw new Error(`No A4u export found in ${file}`);
    }

    let iconComponent = iconModule[exportName];
    let markup = renderToStaticMarkup(React.createElement(iconComponent, null));
    let {attrs, innerHTML} = parseSvgMarkup(markup, file);
    let iconSource = generateIconFile(iconName, attrs, innerHTML);

    fs.writeFileSync(path.join(outputDir, `${iconName}.ts`), iconSource);
    indexExports.push(`export {default as ${toIdentifier(iconName)}} from './${iconName}';`);
  }

  fs.writeFileSync(path.join(outputDir, 'index.ts'), `${indexExports.join('\n')}\n`);

  console.log(`Generated ${files.length} Vue workflow icons in ${outputDir}`);
}

main();
