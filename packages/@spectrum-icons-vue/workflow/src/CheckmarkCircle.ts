import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16.00008,16.00008,0,0,0,18,2Zm10.666,9.08044L16.01758,27.34119a1.20831,1.20831,0,0,1-.875.46093c-.02344.002-.04883.002-.07227.002a1.19938,1.19938,0,0,1-.84961-.35157L6.43555,19.65759a1.2,1.2,0,0,1,0-1.69726l1.32617-1.3252a1.20121,1.20121,0,0,1,1.69531,0l5.3457,5.34668L25.31445,8.473A1.20291,1.20291,0,0,1,27,8.26306l1.45508,1.13281A1.20477,1.20477,0,0,1,28.666,11.08044Z"></path>`;

const CheckmarkCircle = createWorkflowIcon('VueWorkflowCheckmarkCircle', svgAttributes, svgInnerHTML);

export default CheckmarkCircle;
