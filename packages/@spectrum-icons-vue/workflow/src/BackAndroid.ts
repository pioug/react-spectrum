import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.5,16.08H7.5l9.94-9.94a.967.967,0,0,0,0-1.4l-.7-.72a1.027,1.027,0,0,0-1.42,0L2.48,16.88a1.027,1.027,0,0,0,0,1.42L15.26,31.98a1.027,1.027,0,0,0,1.42,0l.7-.7a1.027,1.027,0,0,0,0-1.42L7.52,19H35.5a.5.5,0,0,0,.5-.5V16.58A.5.5,0,0,0,35.5,16.08Z"></path>`;

const BackAndroid = createWorkflowIcon('VueWorkflowBackAndroid', svgAttributes, svgInnerHTML);

export default BackAndroid;
