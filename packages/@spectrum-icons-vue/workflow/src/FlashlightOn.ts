import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26.9,10.148a1.044,1.044,0,0,1-.738-1.781L29.635,4.89A1.043,1.043,0,1,1,31.11,6.365L27.633,9.842A1.038,1.038,0,0,1,26.9,10.148Z"></path><path fill-rule="evenodd" d="M22.663,6.85a1.04,1.04,0,0,1-1.029-1.216l.7-4.162a1.043,1.043,0,1,1,2.057.345l-.7,4.162A1.043,1.043,0,0,1,22.663,6.85Z"></path><path fill-rule="evenodd" d="M30.193,14.384a1.043,1.043,0,0,1-.171-2.072l4.162-.695a1.042,1.042,0,1,1,.345,2.056l-4.162.7A.937.937,0,0,1,30.193,14.384Z"></path><path fill-rule="evenodd" d="M29.361,18.209l-.84.841L16.95,7.479l.841-.84a.817.817,0,0,1,1.157,0L29.361,17.052A.817.817,0,0,1,29.361,18.209Z"></path><path fill-rule="evenodd" d="M15.317,9.13l-.68.717a1.635,1.635,0,0,0-.4,1.072L12.6,18.49,2.183,28.911a.817.817,0,0,0,0,1.157l3.772,3.771a.817.817,0,0,0,1.157,0L17.51,23.4l7.571-1.636a1.635,1.635,0,0,0,1.072-.4l.717-.68ZM14.011,23.724l-2.454,2.455a1.228,1.228,0,0,1-1.736-1.736l2.455-2.454a1.227,1.227,0,0,1,1.735,1.735Z"></path>`;

const FlashlightOn = createWorkflowIcon('VueWorkflowFlashlightOn', svgAttributes, svgInnerHTML);

export default FlashlightOn;
