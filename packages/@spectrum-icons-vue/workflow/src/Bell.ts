import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,36a4.406,4.406,0,0,0,4-4H14A4.406,4.406,0,0,0,18,36Z"></path><path fill-rule="evenodd" d="M27.143,11.385c0-3.437-3.206-4.891-7.143-5.268V3a1.079,1.079,0,0,0-1.143-1H17.143A1.079,1.079,0,0,0,16,3V6.117c-3.937.377-7.143,1.831-7.143,5.268C8.857,26.8,4,26.111,4,28.154V30H32V28.154C32,26,27.143,26.8,27.143,11.385Z"></path>`;

const Bell = createWorkflowIcon('VueWorkflowBell', svgAttributes, svgInnerHTML);

export default Bell;
