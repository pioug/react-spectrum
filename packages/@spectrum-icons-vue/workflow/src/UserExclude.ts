import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.7,27a12.266,12.266,0,0,1,4.311-9.342V16.249a1.441,1.441,0,0,1,.367-.93,11,11,0,0,0,2.5-6.866c0-5.2-2.756-8.1-6.919-8.1s-7,3.018-7,8.1a11.121,11.121,0,0,0,2.622,6.866,1.443,1.443,0,0,1,.367.93v2.074A1.431,1.431,0,0,1,9.7,19.767C1.338,20.5.031,26.217.031,28.474c0,.251.048,1.484.048,1.484H15.073A12.288,12.288,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20.2,27a6.749,6.749,0,0,1,1.289-3.957l9.468,9.468A6.78,6.78,0,0,1,20.2,27Zm12.311,3.957-9.468-9.468a6.78,6.78,0,0,1,9.468,9.468Z"></path>`;

const UserExclude = createWorkflowIcon('VueWorkflowUserExclude', svgAttributes, svgInnerHTML);

export default UserExclude;
