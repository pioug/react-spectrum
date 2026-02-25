import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,27a10.98316,10.98316,0,0,1,4-8.47839V5a.72593.72593,0,0,0-1.19434-.57129L8.167,11.22839c-.439.4469-.72619.84485-1.42187.84485H1a1,1,0,0,0-1,1v9.92285a1,1,0,0,0,1,1H6.74512c.69641,0,.99609.41138,1.42187.84485L12.17188,28.943A11.02155,11.02155,0,0,1,12,27Z"></path><path fill-rule="evenodd" d="M23,18.1A8.9,8.9,0,1,0,31.8999,27,8.90007,8.90007,0,0,0,23,18.1ZM16,27a6.93453,6.93453,0,0,1,1.47461-4.252L27.252,32.52539A6.96595,6.96595,0,0,1,16,27Zm12.52539,4.252-9.77734-9.77734A6.96595,6.96595,0,0,1,28.52539,31.252Z"></path>`;

const VolumeMute = createWorkflowIcon('VueWorkflowVolumeMute', svgAttributes, svgInnerHTML);

export default VolumeMute;
