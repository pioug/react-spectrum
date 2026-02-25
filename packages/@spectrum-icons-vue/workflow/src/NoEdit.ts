import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="43.854" rx="0.818" ry="0.818" transform="translate(-7.456 18) rotate(-45)" width="2.455" x="16.773" y="-3.927"></rect><path fill-rule="evenodd" d="M11.181,17.275l-6.1,6.1a1,1,0,0,0-.251.421L2.056,33.1c-.114.376.459.85.783.85a.3.3,0,0,0,.061-.006c.276-.064,7.867-2.344,9.312-2.779a.974.974,0,0,0,.414-.249l6.1-6.1ZM4.668,31.338l2.009-6.731,4.72,4.708C9.236,29.965,6.535,30.781,4.668,31.338Z"></path><path fill-rule="evenodd" d="M33.567,8.2,27.8,2.432a1.215,1.215,0,0,0-.867-.353H26.9a1.371,1.371,0,0,0-.927.406l-8.8,8.624,7.543,7.542,8.8-8.623a1.375,1.375,0,0,0,.4-.883A1.223,1.223,0,0,0,33.567,8.2Z"></path>`;

const NoEdit = createWorkflowIcon('VueWorkflowNoEdit', svgAttributes, svgInnerHTML);

export default NoEdit;
