import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<ellipse fill-rule="evenodd" cx="18" cy="7" rx="16" ry="5"></ellipse><path fill-rule="evenodd" d="M18,24.275c-4.936,0-14.212-1.169-16-4V29c0,2.761,7.163,5,16,5s16-2.239,16-5V20.27C31.553,23.365,22.936,24.275,18,24.275Z"></path><path fill-rule="evenodd" d="M18,14.275c-4.936,0-14.212-1.169-16-4.005V17c0,2.761,7.163,5,16,5s16-2.239,16-5V10.27C31.553,13.365,22.936,14.275,18,14.275Z"></path>`;

const Data = createWorkflowIcon('VueWorkflowData', svgAttributes, svgInnerHTML);

export default Data;
