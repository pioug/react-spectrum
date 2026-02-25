import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.285,4.2,21.722,1.183a1.515,1.515,0,0,0-1.443,0L6.409,8.7a.781.781,0,0,0,0,1.373L11.645,12.9Z"></path><path fill-rule="evenodd" d="M35.591,8.7,30.442,5.906,14.8,14.615,21,17.972l14.591-7.9A.781.781,0,0,0,35.591,8.7Z"></path><path fill-rule="evenodd" d="M22,20.971v14.4l13.177-7.32a1.6,1.6,0,0,0,.823-1.4V13.193Z"></path><path fill-rule="evenodd" d="M6,13.193v2.664L17.646,27.5a.5.5,0,0,1,0,.707l-3.762,3.762L20,35.371v-14.4Z"></path><path fill-rule="evenodd" d="M6,24V20.672a.5.5,0,0,1,.866-.341L14,28,6.866,35.669A.5.5,0,0,1,6,35.328V32H1a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1Z"></path>`;

const BoxImport = createWorkflowIcon('VueWorkflowBoxImport', svgAttributes, svgInnerHTML);

export default BoxImport;
