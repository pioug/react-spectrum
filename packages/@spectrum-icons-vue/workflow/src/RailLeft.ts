import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.875,4H1.125A1.146,1.146,0,0,0,0,5.167V30.833A1.146,1.146,0,0,0,1.125,32h33.75A1.146,1.146,0,0,0,36,30.833V5.167A1.146,1.146,0,0,0,34.875,4ZM9.3,24H2.7V22H9.3Zm0-6H2.7V16H9.3Zm0-6H2.7V10H9.3ZM34,30H12V10H34Z"></path>`;

const RailLeft = createWorkflowIcon('VueWorkflowRailLeft', svgAttributes, svgInnerHTML);

export default RailLeft;
