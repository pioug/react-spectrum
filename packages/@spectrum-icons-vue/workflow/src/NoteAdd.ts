import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M14.8,27a12.13,12.13,0,0,1,1.08-5H8.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h8.519a12.233,12.233,0,0,1,4.732-4H8.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h21a.5.5,0,0,1,.5.5v.687a12.142,12.142,0,0,1,4,1.83V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V27a1,1,0,0,0,1,1h9l3.536,6.839a.5.5,0,0,0,.928,0l.483-.934A12.139,12.139,0,0,1,14.8,27ZM8,8.5A.5.5,0,0,1,8.5,8h17a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H8.5A.5.5,0,0,1,8,9.5Z"></path>`;

const NoteAdd = createWorkflowIcon('VueWorkflowNoteAdd', svgAttributes, svgInnerHTML);

export default NoteAdd;
