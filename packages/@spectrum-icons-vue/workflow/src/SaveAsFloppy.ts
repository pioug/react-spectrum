import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="4" x="20" y="2"></rect><path fill-rule="evenodd" d="M15.769,32H8V16H21.52A12.24,12.24,0,0,1,34,16.893V8.42a1,1,0,0,0-.292-.707s-5.425-5.422-5.557-5.535A.967.967,0,0,0,27.589,2H26v8H12V2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H16.892A12.255,12.255,0,0,1,15.769,32Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const SaveAsFloppy = createWorkflowIcon('VueWorkflowSaveAsFloppy', svgAttributes, svgInnerHTML);

export default SaveAsFloppy;
