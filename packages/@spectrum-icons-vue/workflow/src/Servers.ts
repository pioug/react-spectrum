import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M11,10H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V6H4V2.5A.5.5,0,0,0,3.5,2h-1a.5.5,0,0,0-.5.5v31a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30h6v3a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V27a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1v1H4V20h6v1a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V15a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1v3H4V8h6V9A1,1,0,0,0,11,10Zm1,18h4v2H12Zm0-12h4v2H12ZM12,4h4V6H12Z"></path>`;

const Servers = createWorkflowIcon('VueWorkflowServers', svgAttributes, svgInnerHTML);

export default Servers;
