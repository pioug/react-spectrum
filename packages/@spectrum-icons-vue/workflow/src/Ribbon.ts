import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M11.776,22.661,7.564,30.24a.5.5,0,0,0,.617.693L12.2,29.5a.5.5,0,0,1,.639.3l1.432,4.016a.5.5,0,0,0,.926.038l1.681-3.708-3.042-6.441A11.429,11.429,0,0,1,11.776,22.661Zm16.66,7.579-3.869-7.807a11.248,11.248,0,0,1-8.218,1.935l4.459,9.49a.5.5,0,0,0,.925-.038L23.165,29.8a.5.5,0,0,1,.64-.3l4.014,1.432A.5.5,0,0,0,28.436,30.24Z"></path><path fill-rule="evenodd" d="M18,4a9,9,0,1,0,9,9A9,9,0,0,0,18,4Zm0,14.5A5.5,5.5,0,1,1,23.5,13,5.5,5.5,0,0,1,18,18.5Z"></path>`;

const Ribbon = createWorkflowIcon('VueWorkflowRibbon', svgAttributes, svgInnerHTML);

export default Ribbon;
