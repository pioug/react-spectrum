import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,24H4V4H32V16h2V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H14Z"></path><path fill-rule="evenodd" d="M35,18H17a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V22h4V32H23a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V33a1,1,0,0,0-1-1H28V22h4v1a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V19A1,1,0,0,0,35,18Z"></path>`;

const ProjectNameEdit = createWorkflowIcon('VueWorkflowProjectNameEdit', svgAttributes, svgInnerHTML);

export default ProjectNameEdit;
