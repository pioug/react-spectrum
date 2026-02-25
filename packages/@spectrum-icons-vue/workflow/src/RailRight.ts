import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M0,5.167V30.833A1.146,1.146,0,0,0,1.125,32h33.75A1.146,1.146,0,0,0,36,30.833V5.167A1.146,1.146,0,0,0,34.875,4H1.125A1.146,1.146,0,0,0,0,5.167ZM33.3,11.5a.5.5,0,0,1-.5.5H27.2a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h5.6a.5.5,0,0,1,.5.5Zm0,6a.5.5,0,0,1-.5.5H27.2a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h5.6a.5.5,0,0,1,.5.5Zm-6.6,5a.5.5,0,0,1,.5-.5h5.6a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H27.2a.5.5,0,0,1-.5-.5ZM2,10H24V30H2Z"></path>`;

const RailRight = createWorkflowIcon('VueWorkflowRailRight', svgAttributes, svgInnerHTML);

export default RailRight;
