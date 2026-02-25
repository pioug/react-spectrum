import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M1.125,32h33.75A1.147,1.147,0,0,0,36,30.833V5.167A1.147,1.147,0,0,0,34.875,4H1.125A1.147,1.147,0,0,0,0,5.167V30.833A1.147,1.147,0,0,0,1.125,32ZM15.4,8.5a.5.5,0,0,1,.5-.5H33.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H15.9a.5.5,0,0,1-.5-.5ZM2,12H34V28H2Z"></path>`;

const RailTop = createWorkflowIcon('VueWorkflowRailTop', svgAttributes, svgInnerHTML);

export default RailTop;
