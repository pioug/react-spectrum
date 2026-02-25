import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,27a11.013,11.013,0,0,1,5.761-9.67,13.413,13.413,0,0,0,1.727-6.288C23.488,5.617,20.4,2,15.956,2S8.424,5.617,8.424,11.042c0,5.015,3.532,8.958,3.532,8.958,0,1.652-.026,2.977-1.673,3.12C8.031,23.316.666,25.763,0,32.947a.993.993,0,0,0,1,1.053H18.522A10.944,10.944,0,0,1,16,27Z"></path><path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm4.9,10.5H28.5v3.4a.5.5,0,0,1-.5.5H26a.5.5,0,0,1-.5-.5V28.5H22.1a.5.5,0,0,1-.5-.5V26a.5.5,0,0,1,.5-.5h3.4V22.1a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v3.4h3.4a.5.5,0,0,1,.5.5v2A.5.5,0,0,1,31.9,28.5Z"></path>`;

const UserAdd = createWorkflowIcon('VueWorkflowUserAdd', svgAttributes, svgInnerHTML);

export default UserAdd;
