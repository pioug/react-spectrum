import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,2H6A4,4,0,0,0,2,6V22a4,4,0,0,0,4,4H8v8.793a.5.5,0,0,0,.854.354L18,26H30a4,4,0,0,0,4-4V6A4,4,0,0,0,30,2ZM8,17.35a3.85,3.85,0,1,1,3.85-3.85A3.85,3.85,0,0,1,8,17.35Zm10,0a3.85,3.85,0,1,1,3.85-3.85A3.85,3.85,0,0,1,18,17.35Zm10,0a3.85,3.85,0,1,1,3.85-3.85A3.85,3.85,0,0,1,28,17.35Z"></path>`;

const Feedback = createWorkflowIcon('VueWorkflowFeedback', svgAttributes, svgInnerHTML);

export default Feedback;
