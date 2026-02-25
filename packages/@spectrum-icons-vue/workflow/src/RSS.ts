import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="7.993" cy="28.007" r="4"></circle><path fill-rule="evenodd" d="M21.983,32.007h-4a.5.5,0,0,1-.5-.489,13.519,13.519,0,0,0-13-13,.5.5,0,0,1-.488-.5l0-4a.5.5,0,0,1,.511-.5A18.525,18.525,0,0,1,22.486,31.5.5.5,0,0,1,21.983,32.007Z"></path><path fill-rule="evenodd" d="M31.985,32.007h-4a.5.5,0,0,1-.5-.493,23.7,23.7,0,0,0-23-23.19.5.5,0,0,1-.493-.5V4.015a.5.5,0,0,1,.51-.5A28.535,28.535,0,0,1,32.489,31.5.5.5,0,0,1,31.985,32.007Z"></path>`;

const RSS = createWorkflowIcon('VueWorkflowRSS', svgAttributes, svgInnerHTML);

export default RSS;
