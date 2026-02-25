import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.875,4H1.125A1.147,1.147,0,0,0,0,5.167V30.833A1.147,1.147,0,0,0,1.125,32h33.75A1.147,1.147,0,0,0,36,30.833V5.167A1.147,1.147,0,0,0,34.875,4ZM20.6,27.5a.5.5,0,0,1-.5.5H2.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H20.1a.5.5,0,0,1,.5.5ZM34,24H2V8H34Z"></path>`;

const RailBottom = createWorkflowIcon('VueWorkflowRailBottom', svgAttributes, svgInnerHTML);

export default RailBottom;
