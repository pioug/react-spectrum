import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.191,32.143,28.646,27.6A9.065,9.065,0,1,0,25.6,30.646l4.546,4.545a2.044,2.044,0,0,0,3.048,0A2.133,2.133,0,0,0,33.781,34,2.163,2.163,0,0,0,33.191,32.143ZM15.412,22.98a5.568,5.568,0,1,1,5.568,5.568A5.568,5.568,0,0,1,15.412,22.98Z"></path><path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V31a1,1,0,0,0,1,1H14.232a11.322,11.322,0,0,1-2.068-2H4V10H32V27.777l2,1.99V5A1,1,0,0,0,33,4Z"></path>`;

const Preview = createWorkflowIcon('VueWorkflowPreview', svgAttributes, svgInnerHTML);

export default Preview;
