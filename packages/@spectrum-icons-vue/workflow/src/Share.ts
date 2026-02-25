import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,10H27a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h3V30H6V14H9a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10Z"></path><path fill-rule="evenodd" d="M10.8,8H16V19a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h5.2a.8.8,0,0,0,.8-.8.787.787,0,0,0-.2-.527L18.351.144a.5.5,0,0,0-.7,0L10.2,6.668A.787.787,0,0,0,10,7.2.8.8,0,0,0,10.8,8Z"></path>`;

const Share = createWorkflowIcon('VueWorkflowShare', svgAttributes, svgInnerHTML);

export default Share;
