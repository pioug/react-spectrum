import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.191,1.113,1.8,10.478a.5.5,0,0,0-.08.926L9.64,15.358Z"></path><path fill-rule="evenodd" d="M15.645,22.372,10.08,19.25v7.639a.713.713,0,0,0,1.174.544l3.795-3.2A12.239,12.239,0,0,1,15.645,22.372Z"></path><path fill-rule="evenodd" d="M27,14.8a12.288,12.288,0,0,1,2.786.329L35.637,2.364,13.089,17.031l4.435,2.229A12.273,12.273,0,0,1,27,14.8Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path>`;

const PublishReject = createWorkflowIcon('VueWorkflowPublishReject', svgAttributes, svgInnerHTML);

export default PublishReject;
