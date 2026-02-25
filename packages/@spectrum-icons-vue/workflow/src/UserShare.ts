import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.807,17.242l.2-.227v-.766a1.441,1.441,0,0,1,.367-.93,11,11,0,0,0,2.5-6.866c0-5.2-2.756-8.1-6.919-8.1s-7,3.018-7,8.1a11.121,11.121,0,0,0,2.622,6.866,1.443,1.443,0,0,1,.367.93v2.074A1.431,1.431,0,0,1,9.7,19.767C1.338,20.5.031,26.217.031,28.474c0,.251.048,1.484.048,1.484H14V22a2,2,0,0,1,2-2h1.97S17.852,18.07,18.807,17.242Z"></path><path fill-rule="evenodd" d="M31.722,18.331,26,12l-5.708,6.331A1,1,0,0,0,21.035,20H24v7.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V20h2.979A1,1,0,0,0,31.722,18.331Z"></path><path fill-rule="evenodd" d="M32,22V32H20V22H17a1,1,0,0,0-1,1V35a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1Z"></path>`;

const UserShare = createWorkflowIcon('VueWorkflowUserShare', svgAttributes, svgInnerHTML);

export default UserShare;
