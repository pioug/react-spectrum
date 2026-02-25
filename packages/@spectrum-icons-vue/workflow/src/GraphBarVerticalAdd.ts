import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23,12H19a1,1,0,0,0-1,1v5.635a12.269,12.269,0,0,1,6-3.551V13A1,1,0,0,0,23,12Z"></path><path fill-rule="evenodd" d="M18.1,27A8.9,8.9,0,1,0,27,18.1,8.9,8.9,0,0,0,18.1,27Zm3.9-.5a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5Z"></path><path fill-rule="evenodd" d="M32,15.769V3a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1V14.75c.331-.027.662-.05,1-.05A12.241,12.241,0,0,1,32,15.769Z"></path><path fill-rule="evenodd" d="M.5,34H16.893a12.321,12.321,0,0,1-1.124-2H.5a.5.5,0,0,0-.5.5v1A.5.5,0,0,0,.5,34Z"></path><path fill-rule="evenodd" d="M16,21a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1v9h5.084A12.1,12.1,0,0,1,16,21.52Z"></path><path fill-rule="evenodd" d="M3,24a1,1,0,0,0-1,1v5H8V25a1,1,0,0,0-1-1Z"></path>`;

const GraphBarVerticalAdd = createWorkflowIcon('VueWorkflowGraphBarVerticalAdd', svgAttributes, svgInnerHTML);

export default GraphBarVerticalAdd;
