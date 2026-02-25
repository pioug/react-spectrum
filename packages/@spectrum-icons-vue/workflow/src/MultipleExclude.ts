import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,2H19a1,1,0,0,0-1,1V8h4a2,2,0,0,1,2,2v4h5a1,1,0,0,0,1-1V3A1,1,0,0,0,29,2Z"></path><rect fill-rule="evenodd" height="12" rx="1" ry="1" width="12" x="2" y="18"></rect><path fill-rule="evenodd" d="M16,18v3.492a12.351,12.351,0,0,1,6-5.733V11a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1v5h4A2,2,0,0,1,16,18Z"></path><path fill-rule="evenodd" d="M27.1,18.2A8.9,8.9,0,1,0,36,27.1,8.9,8.9,0,0,0,27.1,18.2Zm-7,8.9a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20.1,27.1Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const MultipleExclude = createWorkflowIcon('VueWorkflowMultipleExclude', svgAttributes, svgInnerHTML);

export default MultipleExclude;
