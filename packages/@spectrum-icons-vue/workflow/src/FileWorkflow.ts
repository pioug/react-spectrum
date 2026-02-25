import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M36,27.5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5V26H28v6h2V30.5a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5v5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5V34H26.5a.5.5,0,0,1-.5-.5V30H24v3.5a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5V28h2V24.5a.5.5,0,0,1,.5-.5H30V22.5a.5.5,0,0,1,.5-.5h5a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M15.5,33.5v-9a3,3,0,0,1,3-3h9.172A2.991,2.991,0,0,1,30,19.579V14H19a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1h8.551A2.912,2.912,0,0,1,15.5,33.5Z"></path>`;

const FileWorkflow = createWorkflowIcon('VueWorkflowFileWorkflow', svgAttributes, svgInnerHTML);

export default FileWorkflow;
