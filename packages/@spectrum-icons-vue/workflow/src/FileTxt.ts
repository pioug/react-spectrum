import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm7,15.5a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5Zm0-4a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5Zm0-4a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5Z"></path>`;

const FileTxt = createWorkflowIcon('VueWorkflowFileTxt', svgAttributes, svgInnerHTML);

export default FileTxt;
