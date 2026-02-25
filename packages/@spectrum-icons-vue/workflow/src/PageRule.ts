import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.875,4H1.125A1.147,1.147,0,0,0,0,5.167V30.833A1.147,1.147,0,0,0,1.125,32h33.75A1.147,1.147,0,0,0,36,30.833V5.167A1.147,1.147,0,0,0,34.875,4ZM34,30H2V8H34Z"></path><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="28" x="4" y="12"></rect>`;

const PageRule = createWorkflowIcon('VueWorkflowPageRule', svgAttributes, svgInnerHTML);

export default PageRule;
