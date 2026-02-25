import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M19.237,26.8l9.084,5.063a.819.819,0,0,0,1.1-.366l6.485-16.146Z"></path><path fill-rule="evenodd" d="M16.083,27.763V35.2a.5.5,0,0,0,.824.381l5.32-4.525Z"></path><path fill-rule="evenodd" d="M7.662,24H4V4H32v7.8l1.96-.611H34V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1h8.667Z"></path><path fill-rule="evenodd" d="M34.791,13.535,9.078,21.444a.409.409,0,0,0-.066.759l7.114,3.479Z"></path>`;

const AssetsPublished = createWorkflowIcon('VueWorkflowAssetsPublished', svgAttributes, svgInnerHTML);

export default AssetsPublished;
