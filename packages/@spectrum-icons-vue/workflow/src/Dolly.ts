import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.841,24H24L20.364,8h5.584a.375.375,0,0,0,.237-.666L18,.65,9.815,7.334A.375.375,0,0,0,10.052,8h5.584L12,24H5.159a.75.75,0,0,0-.465,1.338L18,35.85,31.306,25.338A.75.75,0,0,0,30.841,24Z"></path>`;

const Dolly = createWorkflowIcon('VueWorkflowDolly', svgAttributes, svgInnerHTML);

export default Dolly;
