import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.1,3.325l2.52,7.087,6.793-3.229a.5.5,0,0,1,.666.666l-3.229,6.793,7.087,2.52a.5.5,0,0,1,0,.942l-7.087,2.52,3.229,6.793a.5.5,0,0,1-.666.666l-6.793-3.229L18.1,31.942a.5.5,0,0,1-.942,0l-2.52-7.087L7.849,28.084a.5.5,0,0,1-.666-.666l3.229-6.793L3.325,18.1a.5.5,0,0,1,0-.942l7.087-2.52L7.183,7.849a.5.5,0,0,1,.666-.666l6.793,3.229,2.52-7.087A.5.5,0,0,1,18.1,3.325Z"></path>`;

const Starburst = createWorkflowIcon('VueWorkflowStarburst', svgAttributes, svgInnerHTML);

export default Starburst;
