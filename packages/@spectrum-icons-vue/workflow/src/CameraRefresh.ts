import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.8,26.862a12.346,12.346,0,0,1,.525-2.835,8.2,8.2,0,1,1,9.854-8.186c.271-.021.541-.042.816-.042a11.213,11.213,0,0,1,6.435,2.14L34,17.363V7a1,1,0,0,0-1-1H26.95L23.6,2.326A1,1,0,0,0,22.859,2H13.141a1,1,0,0,0-.739.326L9.05,6H3A1,1,0,0,0,2,7V27a1,1,0,0,0,1,1H15.733Z"></path><path fill-rule="evenodd" d="M23.975,16.247c0-.084.025-.163.025-.247a6,6,0,1,0-6.8,5.919A11.413,11.413,0,0,1,23.975,16.247Z"></path><path fill-rule="evenodd" d="M27,33.363a6.143,6.143,0,0,1-4.718-2.1l2.282-2.287H18.1v6.477l2.476-2.481A8.648,8.648,0,0,0,27,35.9,9.2,9.2,0,0,0,35.9,27H33.645A6.812,6.812,0,0,1,27,33.363Z"></path><path fill-rule="evenodd" d="M33.485,21.026A9.112,9.112,0,0,0,27,18.1,9.2,9.2,0,0,0,18.1,27h2.255A6.812,6.812,0,0,1,27,20.636a6.214,6.214,0,0,1,4.817,2.093l-2.245,2.293H35.9V18.56Z"></path>`;

const CameraRefresh = createWorkflowIcon('VueWorkflowCameraRefresh', svgAttributes, svgInnerHTML);

export default CameraRefresh;
