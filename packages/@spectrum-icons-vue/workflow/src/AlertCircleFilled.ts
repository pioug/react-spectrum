import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM15.4,6.775a.711.711,0,0,1,.337-.675,6.246,6.246,0,0,1,2.225-.458,6.861,6.861,0,0,1,2.232.344.777.777,0,0,1,.4.687v2.45c0,2.885-.577,10.891-.683,11.947a.527.527,0,0,1-.587.52H16.6a.568.568,0,0,1-.578-.473c-.1-1.364-.622-9.1-.622-11.891ZM18,28.85a2.574,2.574,0,0,1-2.8-2.631,2.66,2.66,0,0,1,2.8-2.7,2.632,2.632,0,0,1,2.8,2.7A2.574,2.574,0,0,1,18,28.85Z"></path>`;

const AlertCircleFilled = createWorkflowIcon('VueWorkflowAlertCircleFilled', svgAttributes, svgInnerHTML);

export default AlertCircleFilled;
