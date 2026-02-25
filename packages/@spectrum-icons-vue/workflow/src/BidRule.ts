import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8.485" transform="translate(-1.456 20.485) rotate(-45)" width="8.485" x="19.757" y="7.757"></rect><rect fill-rule="evenodd" height="3.155" rx="0.789" ry="0.789" transform="translate(-3.946 26.491) rotate(-44.995)" width="12.619" x="23.7" y="16.432"></rect><rect fill-rule="evenodd" height="3.155" rx="0.789" ry="0.789" transform="translate(1.019 14.507) rotate(-44.995)" width="12.619" x="11.713" y="4.445"></rect><path fill-rule="evenodd" d="M4.06,34.06,1.94,31.94a1.5,1.5,0,0,1,0-2.122L18,15l3,3L6.182,34.06A1.5,1.5,0,0,1,4.06,34.06Z"></path><path fill-rule="evenodd" d="M34,30V29a1,1,0,0,0-1-1H23a1,1,0,0,0-1,1v1H20.5a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h15a.5.5,0,0,0,.5-.5v-3a.5.5,0,0,0-.5-.5Z"></path>`;

const BidRule = createWorkflowIcon('VueWorkflowBidRule', svgAttributes, svgInnerHTML);

export default BidRule;
