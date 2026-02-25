import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.2,2H6.8A4.8,4.8,0,0,0,2,6.8V29.2A4.8,4.8,0,0,0,6.8,34H29.2A4.8,4.8,0,0,0,34,29.2V6.8A4.8,4.8,0,0,0,29.2,2Zm-.355,10.377L14.566,26.655a.8.8,0,0,1-1.131,0l-6.28-6.278a.8.8,0,0,1,0-1.131l2.491-2.491a.8.8,0,0,1,1.131,0L14,19.98,25.223,8.755a.8.8,0,0,1,1.131,0l2.491,2.491A.8.8,0,0,1,28.845,12.377Z"></path>`;

const SelectBox = createWorkflowIcon('VueWorkflowSelectBox', svgAttributes, svgInnerHTML);

export default SelectBox;
