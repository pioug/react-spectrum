import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,16V34a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V16a2,2,0,0,0-2-2H16A2,2,0,0,0,14,16Zm4,3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5Zm0,7a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5Zm0,7a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5Zm16-14a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5Zm0,7a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5Zm0,7a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5ZM29.5,26h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v1A.5.5,0,0,1,29.5,26Z"></path><circle fill-rule="evenodd" cx="25" cy="9" r="2.5"></circle><path fill-rule="evenodd" d="M12,12.343l-.728-.728a2,2,0,0,0-2.828,0L2,18.059V4H30v8h2V3a1,1,0,0,0-1-1H1A1,1,0,0,0,0,3V25a1,1,0,0,0,1,1H12Z"></path>`;

const Asset = createWorkflowIcon('VueWorkflowAsset', svgAttributes, svgInnerHTML);

export default Asset;
