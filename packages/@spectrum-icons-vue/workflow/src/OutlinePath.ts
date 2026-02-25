import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10.5,22H6V6H22v4.5h2V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V23a1,1,0,0,0,1,1h5.5Z"></path><path fill-rule="evenodd" d="M31,12H25.5v2H30V30H14V25.5H12V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V13A1,1,0,0,0,31,12Z"></path><path fill-rule="evenodd" d="M22,15.5V22H15.5v2H23a1,1,0,0,0,1-1V15.5Z"></path><path fill-rule="evenodd" d="M20.5,12H13a1,1,0,0,0-1,1v7.5h2V14h6.5Z"></path>`;

const OutlinePath = createWorkflowIcon('VueWorkflowOutlinePath', svgAttributes, svgInnerHTML);

export default OutlinePath;
