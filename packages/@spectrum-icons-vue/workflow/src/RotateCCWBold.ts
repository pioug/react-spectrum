import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16.03,16.03,0,0,0,4.644,9.228L1,7.521a.69.69,0,0,0-.531-.027.7.7,0,0,0-.424.9L3.053,16.7a.5.5,0,0,0,.589.276l8.311-3.008a.7.7,0,0,0,.42-.9.686.686,0,0,0-.361-.39L8.335,10.958a11.971,11.971,0,1,1-.161,13.917,2,2,0,0,0-3.274,2.3A16,16,0,1,0,18,2Z" transform="translate(0)"></path>`;

const RotateCCWBold = createWorkflowIcon('VueWorkflowRotateCCWBold', svgAttributes, svgInnerHTML);

export default RotateCCWBold;
