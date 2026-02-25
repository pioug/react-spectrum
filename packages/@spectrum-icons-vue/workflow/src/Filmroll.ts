import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="22" rx="1" ry="1" width="14" x="4" y="8"></rect><path fill-rule="evenodd" d="M26,24a5.015,5.015,0,0,1,5-5h1a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2H20V28h3a3,3,0,0,0,3-3Z"></path><path fill-rule="evenodd" d="M14,6V4a1,1,0,0,0-1-1H9A1,1,0,0,0,8,4V6Z"></path>`;

const Filmroll = createWorkflowIcon('VueWorkflowFilmroll', svgAttributes, svgInnerHTML);

export default Filmroll;
