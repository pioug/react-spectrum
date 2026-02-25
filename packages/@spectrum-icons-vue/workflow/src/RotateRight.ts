import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25,10H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V11A1,1,0,0,0,25,10Z"></path><path fill-rule="evenodd" d="M35.5,15h-2V12a9,9,0,0,0-9-9h-2a1,1,0,0,0-1,1V5a1,1,0,0,0,1,1h2a6,6,0,0,1,6,6v3h-2a.5.5,0,0,0-.5.5.49.49,0,0,0,.147.35l3.537,4.033a.5.5,0,0,0,.632,0l3.537-4.033A.49.49,0,0,0,36,15.5.5.5,0,0,0,35.5,15Z"></path>`;

const RotateRight = createWorkflowIcon('VueWorkflowRotateRight', svgAttributes, svgInnerHTML);

export default RotateRight;
