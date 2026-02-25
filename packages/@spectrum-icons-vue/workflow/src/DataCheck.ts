import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<ellipse fill-rule="evenodd" cx="18" cy="7" rx="16" ry="5"></ellipse><path fill-rule="evenodd" d="M14.7,27a12.3,12.3,0,0,1,.342-2.84C10.02,23.808,3.473,22.605,2,20.27V29c0,2.643,6.568,4.8,14.879,4.982A12.235,12.235,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,14.7a12.236,12.236,0,0,1,7,2.193V10.27c-2.447,3.095-11.064,4-16,4s-14.212-1.169-16-4V17c0,2.527,6,4.61,13.794,4.947A12.293,12.293,0,0,1,27,14.7Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path>`;

const DataCheck = createWorkflowIcon('VueWorkflowDataCheck', svgAttributes, svgInnerHTML);

export default DataCheck;
