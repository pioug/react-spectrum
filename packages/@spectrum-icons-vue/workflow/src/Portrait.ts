import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="11" r="3.5"></circle><path fill-rule="evenodd" d="M31,2H5A1,1,0,0,0,4,3V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V3A1,1,0,0,0,31,2ZM30,32H24V28a2,2,0,0,0,2-2V20a4,4,0,0,0-4-4H14a4,4,0,0,0-4,4v6a2,2,0,0,0,2,2v4H6V4H30Z"></path>`;

const Portrait = createWorkflowIcon('VueWorkflowPortrait', svgAttributes, svgInnerHTML);

export default Portrait;
