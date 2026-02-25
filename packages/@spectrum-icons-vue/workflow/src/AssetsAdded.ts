import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,24H4V4H32V15.624a12.045,12.045,0,0,1,2,1.458V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H14a11.975,11.975,0,0,1,.181-2Z"></path><path fill-rule="evenodd" d="M26,16.05A9.95,9.95,0,1,0,35.95,26,9.95,9.95,0,0,0,26,16.05ZM32,27.5a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5V28H20.5a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5H24V20.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V24h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const AssetsAdded = createWorkflowIcon('VueWorkflowAssetsAdded', svgAttributes, svgInnerHTML);

export default AssetsAdded;
