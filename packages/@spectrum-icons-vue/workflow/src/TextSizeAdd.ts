import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.5,18a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V20H8V30H9.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H6V20H2v1.473a.5.5,0,0,1-.5.5H.5a.5.5,0,0,1-.5-.5V18.5A.5.5,0,0,1,.5,18Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M20,18.522a10.973,10.973,0,0,1,4-2.095V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H9A1,1,0,0,0,8,5v6a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h8Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm4.9,10.4H28.5v3.4a.5.5,0,0,1-.5.5H26a.5.5,0,0,1-.5-.5V28.5H22.1a.5.5,0,0,1-.5-.5V26a.5.5,0,0,1,.5-.5h3.4V22.1a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v3.4h3.4a.5.5,0,0,1,.5.5v2A.5.5,0,0,1,31.9,28.5Z" transform="translate(0)"></path>`;

const TextSizeAdd = createWorkflowIcon('VueWorkflowTextSizeAdd', svgAttributes, svgInnerHTML);

export default TextSizeAdd;
