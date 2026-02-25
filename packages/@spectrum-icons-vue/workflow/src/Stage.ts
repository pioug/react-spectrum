import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8,27V18A21.309,21.309,0,0,0,16,2H3A1,1,0,0,0,2,3V28H7A1,1,0,0,0,8,27Z"></path><path fill-rule="evenodd" d="M25.637,30V16.042l.875-.875a3.617,3.617,0,1,0-2.027-2.113l-8.556,8.875a.732.732,0,0,0,0,1.036L16.965,24A.732.732,0,0,0,18,24l4.707-5.029V30H2v3a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V30Z"></path>`;

const Stage = createWorkflowIcon('VueWorkflowStage', svgAttributes, svgInnerHTML);

export default Stage;
