import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15,8a1,1,0,0,1,1,1v5a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V12H10V24h1a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1H6V12H4v2a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V9A1,1,0,0,1,1,8Z"></path><path fill-rule="evenodd" d="M33,8a1,1,0,0,1,1,1v5a1,1,0,0,1-1,1H31a1,1,0,0,1-1-1V12H28V24h1a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1H23a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1h1V12H22v2a1,1,0,0,1-1,1H19a1,1,0,0,1-1-1V9a1,1,0,0,1,1-1Z"></path>`;

const Capitals = createWorkflowIcon('VueWorkflowCapitals', svgAttributes, svgInnerHTML);

export default Capitals;
