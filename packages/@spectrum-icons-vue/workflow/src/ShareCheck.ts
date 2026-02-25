import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M17.722,6.332,12,0,6.292,6.332A1,1,0,0,0,7.035,8H10v9.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V8h2.979A1,1,0,0,0,17.722,6.332Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path><path fill-rule="evenodd" d="M14.7,27a12.272,12.272,0,0,1,.384-3H4V14H6V10H1a1,1,0,0,0-1,1V27a1,1,0,0,0,1,1H14.75C14.724,27.67,14.7,27.338,14.7,27Z"></path><path fill-rule="evenodd" d="M20,16.893a12.226,12.226,0,0,1,4-1.809V11a1,1,0,0,0-1-1H18v4h2Z"></path>`;

const ShareCheck = createWorkflowIcon('VueWorkflowShareCheck', svgAttributes, svgInnerHTML);

export default ShareCheck;
