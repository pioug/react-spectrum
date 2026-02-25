import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25,32H11a1,1,0,0,1-1-1V27a1,1,0,0,1,1-1h3V10H10v3a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H31a1,1,0,0,1,1,1v7.973a1,1,0,0,1-1,1H27a1,1,0,0,1-1-1V10H22V26h3a1,1,0,0,1,1,1v4A1,1,0,0,1,25,32ZM12,28v2H24V28H20V8h8v4h2V5.96H6V12H8V8h8V28ZM6,5V6H6Z"></path>`;

const TextStroke = createWorkflowIcon('VueWorkflowTextStroke', svgAttributes, svgInnerHTML);

export default TextStroke;
