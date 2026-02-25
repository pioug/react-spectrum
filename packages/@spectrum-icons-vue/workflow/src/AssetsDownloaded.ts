import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,24H4V4H32V15.624a12.045,12.045,0,0,1,2,1.458V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H14a11.975,11.975,0,0,1,.181-2Z"></path><path fill-rule="evenodd" d="M26,16.05A9.95,9.95,0,1,0,35.95,26,9.95,9.95,0,0,0,26,16.05Zm-.17,16.181L20.44,26.867A.5.5,0,0,1,20.779,26H24V20.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V26h3.221a.5.5,0,0,1,.339.867L26.17,32.231A.25.25,0,0,1,25.83,32.231Z"></path>`;

const AssetsDownloaded = createWorkflowIcon('VueWorkflowAssetsDownloaded', svgAttributes, svgInnerHTML);

export default AssetsDownloaded;
