import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28.8,10.613A10.572,10.572,0,0,0,17.986.3a11.349,11.349,0,0,0-2.169.21A11.033,11.033,0,0,0,7.2,10.69C7.2,16.148,12,19.044,12,24v2H24V24C24,19,28.8,15.952,28.8,10.613Z"></path><path fill-rule="evenodd" d="M12,28v2.367a1.5,1.5,0,0,0,.359.973l3.524,4.133A1.5,1.5,0,0,0,17.025,36h1.951a1.5,1.5,0,0,0,1.141-.527l3.525-4.133A1.5,1.5,0,0,0,24,30.367V28Z"></path>`;

const Tips = createWorkflowIcon('VueWorkflowTips', svgAttributes, svgInnerHTML);

export default Tips;
