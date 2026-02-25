import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24.364,6.509A8.013,8.013,0,0,0,18,10.327a8.013,8.013,0,0,0-6.364-3.818A7.636,7.636,0,0,0,4,14.145c0,7.292,14,16.546,14,16.546s14-9.156,14-16.546A7.636,7.636,0,0,0,24.364,6.509Z"></path>`;

const Heart = createWorkflowIcon('VueWorkflowHeart', svgAttributes, svgInnerHTML);

export default Heart;
