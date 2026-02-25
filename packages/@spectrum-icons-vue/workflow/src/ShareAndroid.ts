import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.464,24.227a4.459,4.459,0,0,0-3.157,1.3L12.971,19.194a4.374,4.374,0,0,0,0-2.373l11.336-6.368a4.512,4.512,0,1,0-1.143-1.945L11.845,14.867a4.473,4.473,0,1,0,0,6.282l11.319,6.327a4.472,4.472,0,1,0,4.3-3.249Z"></path>`;

const ShareAndroid = createWorkflowIcon('VueWorkflowShareAndroid', svgAttributes, svgInnerHTML);

export default ShareAndroid;
