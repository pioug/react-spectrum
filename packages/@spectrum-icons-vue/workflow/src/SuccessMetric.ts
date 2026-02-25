import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="4" y="26"></rect><rect fill-rule="evenodd" height="24" rx="1" ry="1" width="8" x="14" y="10"></rect><rect fill-rule="evenodd" height="12" rx="1" ry="1" width="8" x="24" y="22"></rect><path fill-rule="evenodd" d="M12,16H6.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H12Z"></path><path fill-rule="evenodd" d="M7.768,6.27,12,8.979l-1.078,1.684L6.689,7.954a.5.5,0,0,1-.152-.691l.539-.842A.5.5,0,0,1,7.768,6.27Z"></path><path fill-rule="evenodd" d="M16.63,8l-1.9-5.971a.25.25,0,0,0-.314-.163l-1.43.454a.25.25,0,0,0-.163.314L14.532,8Z"></path><path fill-rule="evenodd" d="M24,16h5.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H24Z"></path><path fill-rule="evenodd" d="M28.232,6.27,24,8.979l1.078,1.684,4.233-2.709a.5.5,0,0,0,.152-.691l-.539-.842A.5.5,0,0,0,28.232,6.27Z"></path><path fill-rule="evenodd" d="M19.37,8l1.9-5.971a.25.25,0,0,1,.314-.163l1.43.454a.25.25,0,0,1,.163.314L21.468,8Z"></path>`;

const SuccessMetric = createWorkflowIcon('VueWorkflowSuccessMetric', svgAttributes, svgInnerHTML);

export default SuccessMetric;
