import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="7" rx="1" ry="1" width="7" x="14.5" y="14.5"></rect><path fill-rule="evenodd" d="M29.5,12a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,0-.5-.5h-5a.5.5,0,0,0-.5.5V8H12V6.5a.5.5,0,0,0-.5-.5h-5a.5.5,0,0,0-.5.5v5a.5.5,0,0,0,.5.5H8V24H6.5a.5.5,0,0,0-.5.5v5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V28H24v1.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,0-.5-.5H28V12ZM26,24H24.5a.5.5,0,0,0-.5.5V26H12V24.5a.5.5,0,0,0-.5-.5H10V12h1.5a.5.5,0,0,0,.5-.5V10H24v1.5a.5.5,0,0,0,.5.5H26Z"></path>`;

const Individual = createWorkflowIcon('VueWorkflowIndividual', svgAttributes, svgInnerHTML);

export default Individual;
