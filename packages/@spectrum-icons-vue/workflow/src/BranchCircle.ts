import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="24" cy="24" r="2"></circle><circle fill-rule="evenodd" cx="24" cy="12" r="2"></circle><path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM14.2,18a4.2,4.2,0,0,1-.069.683l6.527,2.8a4.425,4.425,0,1,1-.79,1.837l-6.528-2.8a4.2,4.2,0,1,1,0-5.04l6.528-2.8a4.219,4.219,0,1,1,.791,1.837l-6.528,2.8A4.2,4.2,0,0,1,14.2,18Z"></path>`;

const BranchCircle = createWorkflowIcon('VueWorkflowBranchCircle', svgAttributes, svgInnerHTML);

export default BranchCircle;
