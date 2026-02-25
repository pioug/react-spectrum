import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="4 4 20 4 20 12 21.739 13.739 24 11.232 24 0 0 0 0 24 6 24 6 20 4 20 4 4"></polygon><path fill-rule="evenodd" d="M18.384,17.626,8.854,8.147A.491.491,0,0,0,8.5,8a.5.5,0,0,0-.5.5V31.282a.5.5,0,0,0,.5.5.491.491,0,0,0,.35-.148L14,24.656V22a2,2,0,0,1,2-2h2.233A2.976,2.976,0,0,1,18.384,17.626Z"></path><path fill-rule="evenodd" d="M31.722,18.331,26,12l-5.708,6.331A1,1,0,0,0,21.035,20H24v7.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V20h2.979A1,1,0,0,0,31.722,18.331Z"></path><path fill-rule="evenodd" d="M32,22V32H20V22H17a1,1,0,0,0-1,1V35a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1Z"></path>`;

const EventShare = createWorkflowIcon('VueWorkflowEventShare', svgAttributes, svgInnerHTML);

export default EventShare;
