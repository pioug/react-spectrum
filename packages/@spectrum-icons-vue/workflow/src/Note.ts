import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V27a1,1,0,0,0,1,1H14l3.536,6.839a.5.5,0,0,0,.928,0L22,28H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM8.5,8h17a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H8.5A.5.5,0,0,1,8,9.5v-1A.5.5,0,0,1,8.5,8Zm17,14H8.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h17a.5.5,0,0,1,.5.5v1A.5.5,0,0,1,25.5,22Zm4-6H8.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h21a.5.5,0,0,1,.5.5v1A.5.5,0,0,1,29.5,16Z"></path>`;

const Note = createWorkflowIcon('VueWorkflowNote', svgAttributes, svgInnerHTML);

export default Note;
