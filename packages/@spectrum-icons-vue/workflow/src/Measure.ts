import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25.071,2.444,2.444,25.071a1,1,0,0,0,0,1.414l7.071,7.071a1,1,0,0,0,1.414,0l3.535-3.535-5.3-5.3a.5.5,0,0,1,0-.707l.707-.707a.5.5,0,0,1,.707,0l5.3,5.3,5.657-5.657-3.89-3.889a.5.5,0,0,1,0-.707l.708-.708a.5.5,0,0,1,.707,0l3.889,3.89,5.657-5.657-5.3-5.3a.5.5,0,0,1,0-.707l.707-.707a.5.5,0,0,1,.708,0l5.3,5.3,3.535-3.535a1,1,0,0,0,0-1.414L26.485,2.444A1,1,0,0,0,25.071,2.444Z"></path>`;

const Measure = createWorkflowIcon('VueWorkflowMeasure', svgAttributes, svgInnerHTML);

export default Measure;
