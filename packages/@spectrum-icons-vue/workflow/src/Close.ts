import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26.48528,6.68629,18,15.17157,9.51472,6.68629a1,1,0,0,0-1.41421,0L6.68629,8.10051a1,1,0,0,0,0,1.41421L15.17157,18,6.68629,26.48528a1,1,0,0,0,0,1.41421l1.41422,1.41422a1,1,0,0,0,1.41421,0L18,20.82843l8.48528,8.48528a1,1,0,0,0,1.41421,0l1.41422-1.41422a1,1,0,0,0,0-1.41421L20.82843,18l8.48528-8.48528a1,1,0,0,0,0-1.41421L27.89949,6.68629A1,1,0,0,0,26.48528,6.68629Z"></path>`;

const Close = createWorkflowIcon('VueWorkflowClose', svgAttributes, svgInnerHTML);

export default Close;
