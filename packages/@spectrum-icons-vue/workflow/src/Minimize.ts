import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32.077,2.707a1,1,0,0,0-1.414,0L24.179,9.191,21.2,6.206A.688.688,0,0,0,20.705,6a.7.7,0,0,0-.7.7v8.84a.5.5,0,0,0,.459.459H29.3a.7.7,0,0,0,.7-.7.685.685,0,0,0-.207-.49l-2.984-2.984,6.484-6.484a1,1,0,0,0,0-1.414Z"></path><path fill-rule="evenodd" d="M15.541,20H6.7a.7.7,0,0,0-.7.7.685.685,0,0,0,.207.49l2.984,2.984L2.707,30.663a1,1,0,0,0,0,1.414l1.216,1.216a1,1,0,0,0,1.414,0l6.484-6.484,2.984,2.985A.688.688,0,0,0,15.3,30,.7.7,0,0,0,16,29.3v-8.84A.5.5,0,0,0,15.541,20Z"></path>`;

const Minimize = createWorkflowIcon('VueWorkflowMinimize', svgAttributes, svgInnerHTML);

export default Minimize;
