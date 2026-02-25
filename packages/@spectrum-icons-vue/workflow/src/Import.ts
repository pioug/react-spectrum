import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H11a1,1,0,0,0-1,1V9a1.00005,1.00005,0,0,0,1,1h2a1.00036,1.00036,0,0,0,1-1V6H30V30H14V27a1.00028,1.00028,0,0,0-1-1H11a1,1,0,0,0-1,1v6a1.00005,1.00005,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2Z"></path><path fill-rule="evenodd" d="M16,25.19836A.8.8,0,0,0,16.80469,26a.78566.78566,0,0,0,.52686-.20361l7.5249-7.4458a.5.5,0,0,0,0-.7013l-7.5249-7.44568A.78507.78507,0,0,0,16.80469,10,.8.8,0,0,0,16,10.8015V16H3a1,1,0,0,0-1,1v2a1.00005,1.00005,0,0,0,1,1H16Z"></path>`;

const Import = createWorkflowIcon('VueWorkflowImport', svgAttributes, svgInnerHTML);

export default Import;
