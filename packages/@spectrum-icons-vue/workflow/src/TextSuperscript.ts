import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M3,4A1,1,0,0,0,2,5v6a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1V8h6V28H9a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V29a1,1,0,0,0-1-1H16V8h6v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1Z"></path><path fill-rule="evenodd" d="M31.742,12c-.121,0-.16-.039-.16-.141V3.805a8.128,8.128,0,0,1-2.1.72c-.119.02-.158,0-.158-.121v-1.7c0-.1.02-.141.119-.16a9.969,9.969,0,0,0,2.78-1.2.505.505,0,0,1,.3-.08H33.9c.08,0,.1.039.1.138V11.859c0,.1-.039.141-.119.141Z"></path>`;

const TextSuperscript = createWorkflowIcon('VueWorkflowTextSuperscript', svgAttributes, svgInnerHTML);

export default TextSuperscript;
