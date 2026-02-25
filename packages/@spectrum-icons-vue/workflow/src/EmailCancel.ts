import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,18.188,36,4.665v-1.5A1.147,1.147,0,0,0,34.875,2H1.125A1.147,1.147,0,0,0,0,3.167V4.636Z"></path><polygon fill-rule="evenodd" points="11.165 15.938 0 7.512 0 11.334 0 24.195 11.165 15.938"></polygon><path fill-rule="evenodd" d="M14.7,27a12.244,12.244,0,0,1,2.092-6.863c-.025-.018-.057-.024-.082-.043l-3.628-2.719L0,27.068v1.765A1.147,1.147,0,0,0,1.125,30H15.084A12.273,12.273,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,14.7a12.253,12.253,0,0,1,9,3.935V7.541l-9.577,7.188C26.616,14.72,26.805,14.7,27,14.7Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5.826,12.267a.5.5,0,0,1,0,.707l-1.752,1.752a.5.5,0,0,1-.707,0L27,29.459l-3.367,3.367a.5.5,0,0,1-.707,0l-1.752-1.752a.5.5,0,0,1,0-.707L24.541,27l-3.367-3.367a.5.5,0,0,1,0-.707l1.752-1.752a.5.5,0,0,1,.707,0L27,24.541l3.367-3.367a.5.5,0,0,1,.707,0l1.752,1.752a.5.5,0,0,1,0,.707L29.459,27Z"></path>`;

const EmailCancel = createWorkflowIcon('VueWorkflowEmailCancel', svgAttributes, svgInnerHTML);

export default EmailCancel;
