import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" rx="1" ry="1" width="32" y="2"></rect><path fill-rule="evenodd" d="M27,18.1a8.85,8.85,0,1,0,0,17.7,8.85,8.85,0,0,0,0-17.7Zm5,9.4a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M16.893,20H11a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1H21a1,1,0,0,1,1,1v.769a12.109,12.109,0,0,1,8-.685V10H2V25a1,1,0,0,0,1,1H14.75A12.216,12.216,0,0,1,16.893,20Z"></path>`;

const ArchiveRemove = createWorkflowIcon('VueWorkflowArchiveRemove', svgAttributes, svgInnerHTML);

export default ArchiveRemove;
