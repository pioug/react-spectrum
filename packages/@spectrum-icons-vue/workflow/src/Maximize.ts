import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.077,20.707a1,1,0,0,0-1.414,0L6.179,27.191,3.2,24.206A.688.688,0,0,0,2.705,24a.7.7,0,0,0-.7.7v8.84A.5.5,0,0,0,2.459,34H11.3a.7.7,0,0,0,.7-.7.685.685,0,0,0-.207-.49L8.809,29.821l6.484-6.484a1,1,0,0,0,0-1.414Z"></path><path fill-rule="evenodd" d="M33.541,2H24.7a.7.7,0,0,0-.7.705.685.685,0,0,0,.207.49l2.984,2.984-6.484,6.484a1,1,0,0,0,0,1.414l1.216,1.216a1,1,0,0,0,1.414,0l6.484-6.484,2.984,2.985A.688.688,0,0,0,33.3,12a.7.7,0,0,0,.7-.7V2.459A.5.5,0,0,0,33.541,2Z"></path>`;

const Maximize = createWorkflowIcon('VueWorkflowMaximize', svgAttributes, svgInnerHTML);

export default Maximize;
