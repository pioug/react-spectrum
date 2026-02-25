import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.191,1.113,1.8,10.478a.5.5,0,0,0-.08.926L9.64,15.358Z"></path><path fill-rule="evenodd" d="M15.645,22.372,10.08,19.25v7.639a.713.713,0,0,0,1.174.544l3.795-3.2A12.239,12.239,0,0,1,15.645,22.372Z"></path><path fill-rule="evenodd" d="M27,14.8a12.288,12.288,0,0,1,2.786.329L35.637,2.364,13.089,17.031l4.435,2.229A12.273,12.273,0,0,1,27,14.8Z"></path><polygon fill-rule="evenodd" points="26 26.617 22.868 29.749 24.283 31.163 28 27.446 28 20.323 26 20.323 26 26.617"></polygon><path fill-rule="evenodd" d="M33.717,28.3a6.96,6.96,0,0,1-1.041,2.536l1.437,1.437A8.929,8.929,0,0,0,35.745,28.3Z"></path><path fill-rule="evenodd" d="M35.752,25.7a8.835,8.835,0,0,0-1.6-3.916L32.713,23.2a6.863,6.863,0,0,1,1.014,2.5Z"></path><path fill-rule="evenodd" d="M30.849,32.687A6.772,6.772,0,0,1,27,33.9a6.876,6.876,0,0,1-1.2-13.651V18.242A8.867,8.867,0,0,0,27,35.9a8.733,8.733,0,0,0,5.271-1.791Z"></path><path fill-rule="evenodd" d="M28.2,18.238v2.018a6.887,6.887,0,0,1,2.69,1.093l1.434-1.411A8.834,8.834,0,0,0,28.2,18.238Z"></path>`;

const PublishPending = createWorkflowIcon('VueWorkflowPublishPending', svgAttributes, svgInnerHTML);

export default PublishPending;
