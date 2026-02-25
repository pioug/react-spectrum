import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.2,8H12.8A4.8,4.8,0,0,0,8,12.8V29.2A4.8,4.8,0,0,0,12.8,34H29.2A4.8,4.8,0,0,0,34,29.2V12.8A4.8,4.8,0,0,0,29.2,8Zm1.223,9.049L18.988,28.573a.8.8,0,0,1-1.131,0l-6.28-6.278a.8.8,0,0,1,0-1.131l2.491-2.491a.8.8,0,0,1,1.131,0L18.423,21.9l8.378-8.47a.8.8,0,0,1,1.131,0l2.491,2.491A.8.8,0,0,1,30.423,17.049Z"></path><path fill-rule="evenodd" d="M26,2H6.8A4.8,4.8,0,0,0,2,6.8V26a4,4,0,0,0,4,4H6V6H30A4,4,0,0,0,26,2Z"></path>`;

const SelectBoxAll = createWorkflowIcon('VueWorkflowSelectBoxAll', svgAttributes, svgInnerHTML);

export default SelectBoxAll;
