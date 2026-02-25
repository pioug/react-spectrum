import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,18H31a1,1,0,0,0-1,1V30H6V6H17a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V19A1,1,0,0,0,33,18Z"></path><path fill-rule="evenodd" d="M33.5,2H22.754A.8.8,0,0,0,22,2.8a.784.784,0,0,0,.235.56L26.021,7.15l-7.042,7.042a1,1,0,0,0,0,1.415l1.414,1.414a1,1,0,0,0,1.414,0L28.85,9.979l3.786,3.785A.781.781,0,0,0,33.2,14a.8.8,0,0,0,.8-.754V2.5A.5.5,0,0,0,33.5,2Z"></path>`;

const LinkOut = createWorkflowIcon('VueWorkflowLinkOut', svgAttributes, svgInnerHTML);

export default LinkOut;
