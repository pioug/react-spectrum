import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,20.368V10H16V20.368a6,6,0,1,0,4,0Z"></path><path fill-rule="evenodd" d="M18,1.8A4.2,4.2,0,0,1,22.2,6V18.941l.715.54A8.126,8.126,0,0,1,26.2,26,8.2,8.2,0,1,1,9.8,26a8.126,8.126,0,0,1,3.285-6.519l.715-.54V6A4.2,4.2,0,0,1,18,1.8ZM18,0a6,6,0,0,0-6,6V18.045a10,10,0,1,0,12,0V6A6,6,0,0,0,18,0Z"></path>`;

const Temperature = createWorkflowIcon('VueWorkflowTemperature', svgAttributes, svgInnerHTML);

export default Temperature;
