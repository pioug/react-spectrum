import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.5,16H30V9a1,1,0,0,0-1-1H21a1,1,0,0,0-1,1v7H16V5a1,1,0,0,0-1-1H7A1,1,0,0,0,6,5V16H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H6V29a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V18h4v7a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V18h5.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,35.5,16Z"></path>`;

const AlignMiddle = createWorkflowIcon('VueWorkflowAlignMiddle', svgAttributes, svgInnerHTML);

export default AlignMiddle;
