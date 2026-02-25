import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,3a1,1,0,0,0-1-1H7A1,1,0,0,0,6,3V16.1a15.608,15.608,0,0,0,5.857,12.187l5.674,4.355a.7.7,0,0,0,.937,0l5.674-4.355A15.608,15.608,0,0,0,30,16.1ZM9.722,22.287A14.482,14.482,0,0,1,8,16V4H28Z"></path>`;

const Shield = createWorkflowIcon('VueWorkflowShield', svgAttributes, svgInnerHTML);

export default Shield;
