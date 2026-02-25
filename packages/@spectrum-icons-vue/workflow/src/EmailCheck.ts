import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,18.188,36,4.665v-1.5A1.146,1.146,0,0,0,34.875,2H1.125A1.147,1.147,0,0,0,0,3.167V4.635Z"></path><polygon fill-rule="evenodd" points="11.165 15.938 0 7.511 0 11.333 0 24.195 11.165 15.938"></polygon><path fill-rule="evenodd" d="M14.7,27a12.24,12.24,0,0,1,2.092-6.863c-.026-.018-.057-.024-.082-.043l-3.628-2.719L0,27.068v1.765A1.147,1.147,0,0,0,1.125,30H15.084A12.272,12.272,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,14.7a12.253,12.253,0,0,1,9,3.936V7.541l-9.577,7.188C26.616,14.72,26.805,14.7,27,14.7Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path>`;

const EmailCheck = createWorkflowIcon('VueWorkflowEmailCheck', svgAttributes, svgInnerHTML);

export default EmailCheck;
