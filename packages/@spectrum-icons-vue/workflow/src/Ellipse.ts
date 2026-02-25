import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,5.931c8.883,0,16.11,5.414,16.11,12.069S26.883,30.069,18,30.069,1.89,24.655,1.89,18,9.117,5.931,18,5.931ZM18,4.15C8.114,4.15.1,10.351.1,18S8.114,31.85,18,31.85,35.9,25.649,35.9,18,27.886,4.15,18,4.15Z"></path>`;

const Ellipse = createWorkflowIcon('VueWorkflowEllipse', svgAttributes, svgInnerHTML);

export default Ellipse;
