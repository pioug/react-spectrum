import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.7,27a12.39,12.39,0,0,1,.219-2.278H13.783a.405.405,0,0,1-.4-.405V21.884a.406.406,0,0,1,.4-.406H16.02A12.322,12.322,0,0,1,22.929,15.4L15.708,2.482a.811.811,0,0,0-1.416,0L.725,26.76a.811.811,0,0,0,.708,1.207H14.749C14.724,27.647,14.7,27.326,14.7,27ZM13.378,9.718a.406.406,0,0,1,.4-.406h2.434a.406.406,0,0,1,.405.406v9.733a.405.405,0,0,1-.405.405H13.783a.405.405,0,0,1-.4-.405Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const AlertAdd = createWorkflowIcon('VueWorkflowAlertAdd', svgAttributes, svgInnerHTML);

export default AlertAdd;
