import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.5,6.714a6.788,6.788,0,0,1,6.538,8.606,5.492,5.492,0,0,1,.605-.034,5.357,5.357,0,0,1,0,10.714H6.214a3.215,3.215,0,0,1,0-6.429h.359s0-.918,0-1.428a5.718,5.718,0,0,1,7.2-5.519A6.788,6.788,0,0,1,20.5,6.714Zm0-2a8.811,8.811,0,0,0-8.233,5.715,7.724,7.724,0,0,0-7.69,7.406A5.214,5.214,0,0,0,6.214,28H27.643a7.357,7.357,0,0,0,1.643-14.529A8.8,8.8,0,0,0,20.5,4.714Z"></path>`;

const CloudOutline = createWorkflowIcon('VueWorkflowCloudOutline', svgAttributes, svgInnerHTML);

export default CloudOutline;
