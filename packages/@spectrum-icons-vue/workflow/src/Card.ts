import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,2H5A1,1,0,0,0,4,3V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V3A1,1,0,0,0,31,2ZM12,29.5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5Zm18,0a.5.5,0,0,1-.5.5h-13a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5ZM30,22H6V4H30Z"></path>`;

const Card = createWorkflowIcon('VueWorkflowCard', svgAttributes, svgInnerHTML);

export default Card;
