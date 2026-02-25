import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.1,2.2A15.9,15.9,0,1,0,34,18.1,15.9,15.9,0,0,0,18.1,2.2Zm0,29.812A13.912,13.912,0,1,1,32.012,18.1,13.912,13.912,0,0,1,18.1,32.012Zm8.98143-19.37691L16.20934,26.61056a1,1,0,0,1-1.49677.09257L8.5558,20.57171A1.00069,1.00069,0,0,1,8.55623,19.157l1.32452-1.32451a1,1,0,0,1,1.41418,0l3.878,3.84309,8.87469-11.402a1.00011,1.00011,0,0,1,1.40352-.17487l1.45527,1.13283A1.0003,1.0003,0,0,1,27.08143,12.63509Z"></path>`;

const CheckmarkCircleOutline = createWorkflowIcon('VueWorkflowCheckmarkCircleOutline', svgAttributes, svgInnerHTML);

export default CheckmarkCircleOutline;
