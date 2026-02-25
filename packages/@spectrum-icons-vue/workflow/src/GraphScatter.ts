import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="16" r="2.2"></circle><circle fill-rule="evenodd" cx="16" cy="8" r="2.2"></circle><circle fill-rule="evenodd" cx="30" cy="6" r="2.2"></circle><circle fill-rule="evenodd" cx="20" cy="20" r="2.2"></circle><circle fill-rule="evenodd" cx="26" cy="16" r="2.2"></circle><circle fill-rule="evenodd" cx="12" cy="20" r="2.2"></circle><circle fill-rule="evenodd" cx="12" cy="10" r="2.2"></circle><circle fill-rule="evenodd" cx="16" cy="28" r="2.2"></circle><circle fill-rule="evenodd" cx="6" cy="30" r="2.2"></circle>`;

const GraphScatter = createWorkflowIcon('VueWorkflowGraphScatter', svgAttributes, svgInnerHTML);

export default GraphScatter;
