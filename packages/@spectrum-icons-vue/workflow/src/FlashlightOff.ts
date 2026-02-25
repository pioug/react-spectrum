import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.361,18.209l-.84.841L16.95,7.479l.841-.84a.817.817,0,0,1,1.157,0L29.361,17.052A.817.817,0,0,1,29.361,18.209Z"></path><path fill-rule="evenodd" d="M15.317,9.13l-.68.717a1.635,1.635,0,0,0-.4,1.072L12.6,18.49,2.183,28.911a.817.817,0,0,0,0,1.157l3.772,3.771a.817.817,0,0,0,1.157,0L17.51,23.4l7.571-1.636a1.635,1.635,0,0,0,1.072-.4l.717-.68ZM14.011,23.724l-2.454,2.455a1.228,1.228,0,0,1-1.736-1.736l2.455-2.454a1.227,1.227,0,0,1,1.735,1.735Z"></path>`;

const FlashlightOff = createWorkflowIcon('VueWorkflowFlashlightOff', svgAttributes, svgInnerHTML);

export default FlashlightOff;
