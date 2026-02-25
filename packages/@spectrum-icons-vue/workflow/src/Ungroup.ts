import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9.123,4H31.36V26.237l2,2V3a1,1,0,0,0-1-1H7.123Z"></path><rect fill-rule="evenodd" x="16.132" y="-3.927" width="2.455" height="43.854" rx="0.818" transform="translate(-7.643 17.547) rotate(-45)"></rect><path fill-rule="evenodd" d="M6.36,16h4.5l-5.5-5.5V15A1,1,0,0,0,6.36,16Z"></path><path fill-rule="evenodd" d="M14.36,6.034H9.991L15.36,11.4V7.034A1,1,0,0,0,14.36,6.034Z"></path><path fill-rule="evenodd" d="M8.36,30h8a1,1,0,0,0,1-1V22.5l-2.5-2.5H8.36a1,1,0,0,0-1,1v8A1,1,0,0,0,8.36,30Z"></path><path fill-rule="evenodd" d="M29.36,21V13a1,1,0,0,0-1-1h-8a1,1,0,0,0-1,1v2.356L26,22H28.36A1,1,0,0,0,29.36,21Z"></path><path fill-rule="evenodd" d="M25.731,32H3.36V9.628l-2-2V33a1,1,0,0,0,1,1H27.731Z"></path>`;

const Ungroup = createWorkflowIcon('VueWorkflowUngroup', svgAttributes, svgInnerHTML);

export default Ungroup;
