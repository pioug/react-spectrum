import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.286,9.471A8.787,8.787,0,0,0,12.267,6.429a7.722,7.722,0,0,0-7.689,7.4,5.224,5.224,0,0,0-3.545,5.544A5.346,5.346,0,0,0,6.41,24H11.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H6.4a3.336,3.336,0,0,1-3.391-3.041,3.214,3.214,0,0,1,3.209-3.388h.359s0-.918,0-1.428a5.719,5.719,0,0,1,7.2-5.519,6.787,6.787,0,1,1,13.268,2.7,5.357,5.357,0,1,1,.6,10.68H24.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h2.9a7.517,7.517,0,0,0,7.547-6.484A7.368,7.368,0,0,0,29.286,9.471Z"></path><path fill-rule="evenodd" d="M13.5,18H16V33a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V18h2.5a.5.5,0,0,0,.5-.5.489.489,0,0,0-.117-.317l-4.519-5.023a.5.5,0,0,0-.728,0L13.117,17.18A.489.489,0,0,0,13,17.5.5.5,0,0,0,13.5,18Z"></path>`;

const UploadToCloudOutline = createWorkflowIcon('VueWorkflowUploadToCloudOutline', svgAttributes, svgInnerHTML);

export default UploadToCloudOutline;
