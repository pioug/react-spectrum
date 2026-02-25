import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.647,21.62a29.989,29.989,0,0,1-.771-5.178,9.971,9.971,0,0,1,.612-2.945,5.755,5.755,0,0,0,3.631-5.748,6.111,6.111,0,1,0-12.222,0,5.748,5.748,0,0,0,3.611,5.744,10.467,10.467,0,0,1,.622,2.949,31.39,31.39,0,0,1-.777,5.179c-2.923.148-10,1.767-12.48,2.351A1.146,1.146,0,0,0,2,25.1v3.729A1.153,1.153,0,0,0,3.146,30l29.711,0A1.154,1.154,0,0,0,34,28.836V25.1a1.146,1.146,0,0,0-.873-1.131C30.651,23.388,23.573,21.769,20.647,21.62Z"></path><rect fill-rule="evenodd" x="4" y="32" width="28" height="2" rx="0.5"></rect>`;

const CloneStamp = createWorkflowIcon('VueWorkflowCloneStamp', svgAttributes, svgInnerHTML);

export default CloneStamp;
