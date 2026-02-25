import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" width="2" x="16" y="2"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="6"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="10"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="14"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="18"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="22"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="26"></rect><rect fill-rule="evenodd" height="2" width="2" x="16" y="30"></rect><path fill-rule="evenodd" d="M30.276,28.7,20.2,17.8a1.01,1.01,0,0,1,0-1.428L30.276,5.3A1.01,1.01,0,0,1,32,6.012V27.988A1.01,1.01,0,0,1,30.276,28.7Z"></path><path fill-rule="evenodd" d="M3.845,8.079l8.168,8.843L3.845,25.9ZM3.044,5A1.009,1.009,0,0,0,2.027,6.012V27.988A1.009,1.009,0,0,0,3.045,29a.987.987,0,0,0,.706-.3L13.823,17.633a1.01,1.01,0,0,0,0-1.428L3.751,5.3A.989.989,0,0,0,3.044,5Z"></path>`;

const FlipHorizontal = createWorkflowIcon('VueWorkflowFlipHorizontal', svgAttributes, svgInnerHTML);

export default FlipHorizontal;
