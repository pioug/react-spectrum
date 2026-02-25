import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M5,18H4a2,2,0,0,0-2,2V33a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1V19A1,1,0,0,0,5,18Z"></path><path fill-rule="evenodd" d="M9,20h7.886A12.285,12.285,0,0,1,27,14.7c.337,0,.67.014,1,.041V10a6,6,0,0,0-6-6H14a6,6,0,0,0-6,6v9A1,1,0,0,0,9,20Z"></path><path fill-rule="evenodd" d="M14.7,27a12.256,12.256,0,0,1,1.06-5H9a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6.069A12.3,12.3,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27.1,18.2A8.9,8.9,0,1,0,36,27.1,8.9,8.9,0,0,0,27.1,18.2Zm5,9.4a.5.5,0,0,1-.5.5H28.1v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28.1H22.6a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h3.5V22.6a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v3.5h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const SeatAdd = createWorkflowIcon('VueWorkflowSeatAdd', svgAttributes, svgInnerHTML);

export default SeatAdd;
