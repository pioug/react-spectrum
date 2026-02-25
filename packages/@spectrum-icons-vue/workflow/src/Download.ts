import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,24H31a1,1,0,0,0-1,1v5H6V25a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V25A1,1,0,0,0,33,24Z"></path><path fill-rule="evenodd" d="M17.64941,26.85645a.4999.4999,0,0,0,.70118,0l7.4458-7.525A.785.785,0,0,0,26,18.80469.8.8,0,0,0,25.19824,18H20V3a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1V18H10.80176A.8.8,0,0,0,10,18.80469a.785.785,0,0,0,.20361.52673Z"></path>`;

const Download = createWorkflowIcon('VueWorkflowDownload', svgAttributes, svgInnerHTML);

export default Download;
