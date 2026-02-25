import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22.52148,31.80078a11.30761,11.30761,0,0,1-11.05273-9.02344l-.03127-.16015H1.73438a.25611.25611,0,0,1-.22461-.13086.24871.24871,0,0,1,0-.25586L11.73633,4.33008a.26013.26013,0,0,1,.44922,0l3.9414,6.89844.17969-.11914a11.2791,11.2791,0,1,1,6.21484,20.6914Zm-9.08593-8.93359a9.3813,9.3813,0,1,0,3.78906-10.08985l-.15234.10352,5.34179,9.34961a.24876.24876,0,0,1,0,.25586.25613.25613,0,0,1-.22461.13086H13.37109Z"></path>`;

const Shapes = createWorkflowIcon('VueWorkflowShapes', svgAttributes, svgInnerHTML);

export default Shapes;
