import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,15.8A2.2,2.2,0,1,0,20.2,18,2.2,2.2,0,0,0,18,15.8Z"></path><path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm2,29.552V24H16v7.552A13.7,13.7,0,0,1,4.448,20H12V16H4.448A13.7,13.7,0,0,1,16,4.448V12h4V4.448A13.7,13.7,0,0,1,31.552,16H24v4h7.552A13.7,13.7,0,0,1,20,31.552Z"></path>`;

const Crosshairs = createWorkflowIcon('VueWorkflowCrosshairs', svgAttributes, svgInnerHTML);

export default Crosshairs;
