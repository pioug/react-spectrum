import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,13V7a1,1,0,0,0-1-1H10V1.207A.5.5,0,0,0,9.146.854L0,10l5.33,5.33A12.3,12.3,0,0,1,8.9,14.8c.371,0,.736.023,1.1.056V14H21A1,1,0,0,0,22,13Zm4.854-.146a.5.5,0,0,0-.854.353V18H17.154a12.253,12.253,0,0,1,3.99,8H26v4.793a.5.5,0,0,0,.854.353L36,22Z"></path><path fill-rule="evenodd" d="M8.9,18.2a8.9,8.9,0,1,0,8.9,8.9A8.9,8.9,0,0,0,8.9,18.2Zm5.826,12.267a.5.5,0,0,1,0,.707l-1.752,1.752a.5.5,0,0,1-.707,0L8.9,29.559,5.533,32.926a.5.5,0,0,1-.707,0L3.074,31.174a.5.5,0,0,1,0-.707L6.441,27.1,3.074,23.733a.5.5,0,0,1,0-.707l1.752-1.752a.5.5,0,0,1,.707,0L8.9,24.641l3.367-3.367a.5.5,0,0,1,.707,0l1.752,1.752a.5.5,0,0,1,0,.707L11.359,27.1Z"></path>`;

const SyncRemove = createWorkflowIcon('VueWorkflowSyncRemove', svgAttributes, svgInnerHTML);

export default SyncRemove;
