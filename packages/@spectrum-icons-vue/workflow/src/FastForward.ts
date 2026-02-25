import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.149,30.919V5.081A1,1,0,0,1,15.774,4.3L31.923,17.219a1,1,0,0,1,0,1.562L15.774,31.7A1,1,0,0,1,14.149,30.919Z"></path><path fill-rule="evenodd" d="M12.149,9.519,5.625,4.3A1,1,0,0,0,4,5.081V30.919a1,1,0,0,0,1.625.781l6.524-5.22Z"></path>`;

const FastForward = createWorkflowIcon('VueWorkflowFastForward', svgAttributes, svgInnerHTML);

export default FastForward;
