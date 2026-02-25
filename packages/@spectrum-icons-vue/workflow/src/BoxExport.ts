import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M21.285,4.2,15.722,1.183a1.515,1.515,0,0,0-1.443,0L.409,8.7a.781.781,0,0,0,0,1.373L5.645,12.9Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M29.591,8.7,24.442,5.906,8.8,14.615,15,17.972l14.591-7.9A.781.781,0,0,0,29.591,8.7Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M14,20.971,0,13.193V26.652a1.6,1.6,0,0,0,.823,1.4L14,35.371Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M28,24V20.672a.5.5,0,0,1,.866-.341L36,28l-7.134,7.669A.5.5,0,0,1,28,35.328V32H23a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M27,18h3V13.193L16,20.971v14.4l4-2.222V23a1,1,0,0,1,1-1h5V19A1,1,0,0,1,27,18Z" transform="translate(0)"></path>`;

const BoxExport = createWorkflowIcon('VueWorkflowBoxExport', svgAttributes, svgInnerHTML);

export default BoxExport;
