import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31.091,14H29.6364A11.82255,11.82255,0,0,0,18,2,11.82253,11.82253,0,0,0,6.3636,14H4.909A2.95559,2.95559,0,0,0,2,17v6a2.95571,2.95571,0,0,0,2.909,3H9.2728V14H9.2A8.94073,8.94073,0,0,1,18,4.925,8.94073,8.94073,0,0,1,26.8,14h-.0728V25.338a10.18365,10.18365,0,0,1-6.21081,4.8024A3.11577,3.11577,0,0,0,18,29c-1.6066,0-2.909,1.0074-2.909,2.25S16.3934,33.5,18,33.5a2.78884,2.78884,0,0,0,2.8594-1.8692A11.68249,11.68249,0,0,0,28.0554,26H31.091A2.95571,2.95571,0,0,0,34,23V17A2.95559,2.95559,0,0,0,31.091,14Z"></path>`;

const CallCenter = createWorkflowIcon('VueWorkflowCallCenter', svgAttributes, svgInnerHTML);

export default CallCenter;
