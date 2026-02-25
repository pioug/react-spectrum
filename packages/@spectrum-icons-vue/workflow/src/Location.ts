import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,1.925a12,12,0,0,0-12,12c0,6.627,12,21.75,12,21.75s12-15.123,12-21.75A12,12,0,0,0,18,1.925ZM18,18.65A4.65,4.65,0,1,1,22.65,14,4.65,4.65,0,0,1,18,18.65Z"></path>`;

const Location = createWorkflowIcon('VueWorkflowLocation', svgAttributes, svgInnerHTML);

export default Location;
