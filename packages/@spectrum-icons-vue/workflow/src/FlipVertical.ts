import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" width="2" x="2" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="6" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="10" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="14" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="18" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="22" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="26" y="16"></rect><rect fill-rule="evenodd" height="2" width="2" x="30" y="16"></rect><path fill-rule="evenodd" d="M5.3,30.249,16.2,20.177a1.01,1.01,0,0,1,1.428,0L28.7,30.249a1.01,1.01,0,0,1-.714,1.724H6.012A1.01,1.01,0,0,1,5.3,30.249Z"></path><path fill-rule="evenodd" d="M25.921,3.818l-8.843,8.168L8.1,3.818ZM29,3.017A1.009,1.009,0,0,0,27.988,2H6.012A1.009,1.009,0,0,0,5,3.018a.987.987,0,0,0,.3.706L16.367,13.8a1.01,1.01,0,0,0,1.428,0L28.7,3.724A.989.989,0,0,0,29,3.017Z"></path>`;

const FlipVertical = createWorkflowIcon('VueWorkflowFlipVertical', svgAttributes, svgInnerHTML);

export default FlipVertical;
