import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.354" ry="0.354" width="32" x="2" y="6"></rect><rect fill-rule="evenodd" height="2" rx="0.354" ry="0.354" width="32" x="2" y="14"></rect><path fill-rule="evenodd" d="M32,24v6H4V24Zm1.5-2H2.5a.5.5,0,0,0-.5.5v9a.5.5,0,0,0,.5.5h31a.5.5,0,0,0,.5-.5v-9A.5.5,0,0,0,33.5,22Z"></path>`;

const Form = createWorkflowIcon('VueWorkflowForm', svgAttributes, svgInnerHTML);

export default Form;
