import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,2H5A1,1,0,0,0,4,3V27a1,1,0,0,0,1,1H8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V28H24v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V28h3a1,1,0,0,0,1-1V3A1,1,0,0,0,31,2ZM30,26H6V16H30ZM6,14V4H30V14Z"></path><circle fill-rule="evenodd" cx="18" cy="10" r="2"></circle><circle fill-rule="evenodd" cx="18" cy="20" r="2"></circle>`;

const FilingCabinet = createWorkflowIcon('VueWorkflowFilingCabinet', svgAttributes, svgInnerHTML);

export default FilingCabinet;
