import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.576,28.545c.375-.381,1.254-1.27,1.254-5.854A4.825,4.825,0,0,1,24.3,18.476L22.866,17.4,19.29,20.094a2.171,2.171,0,0,1-2.58,0l-3.628-2.719L0,27.068v1.765A1.147,1.147,0,0,0,1.125,30h18.48A4.107,4.107,0,0,1,20.576,28.545Z"></path><path fill-rule="evenodd" d="M25.931,16.825A3.17,3.17,0,0,1,28.572,15.4h.855a3.156,3.156,0,0,1,3.121,2.547A4.957,4.957,0,0,1,36,21.463V7.541L24.779,15.963Z"></path><path fill-rule="evenodd" d="M36,4.665v-1.5A1.147,1.147,0,0,0,34.875,2H1.125A1.147,1.147,0,0,0,0,3.167V4.635L18,18.188Z"></path><polygon fill-rule="evenodd" points="0 7.511 0 11.333 0 24.194 11.165 15.938 0 7.511"></polygon><path fill-rule="evenodd" d="M36,31.077c0-1.077-2.429-.677-2.429-8.385,0-1.718-1.6-2.446-3.571-2.634V18.5a.539.539,0,0,0-.572-.5h-.857a.539.539,0,0,0-.572.5v1.558c-1.968.188-3.571.916-3.571,2.634C24.429,30.4,22,30.055,22,31.077v.844h4.667v.3a2.333,2.333,0,0,0,4.667,0v-.3H36Z"></path>`;

const EmailNotification = createWorkflowIcon('VueWorkflowEmailNotification', svgAttributes, svgInnerHTML);

export default EmailNotification;
