import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,6V4a4,4,0,0,0-8,0V6H10v4H26V6ZM20,6H16V4a2,2,0,0,1,4,0Z"></path><path fill-rule="evenodd" d="M31,6H28v5a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V6H5A1,1,0,0,0,4,7V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V7A1,1,0,0,0,31,6ZM14.049,25.183a.4.4,0,0,1,0,.563l-1.688,1.688a.4.4,0,0,1-.563,0L6.927,22.563a.8.8,0,0,1,0-1.125L11.8,16.566a.4.4,0,0,1,.563,0l1.688,1.688a.4.4,0,0,1,0,.563L10.866,22Zm3.833,4.7a.4.4,0,0,1-.468.312l-2.34-.468a.4.4,0,0,1-.313-.468L17.788,14.12a.4.4,0,0,1,.468-.312l2.341.468a.4.4,0,0,1,.312.468Zm11.191-7.318L24.2,27.434a.4.4,0,0,1-.563,0l-1.688-1.688a.4.4,0,0,1,0-.563L25.134,22l-3.183-3.183a.4.4,0,0,1,0-.563l1.688-1.688a.4.4,0,0,1,.563,0l4.871,4.871A.8.8,0,0,1,29.073,22.563Z"></path>`;

const PasteHTML = createWorkflowIcon('VueWorkflowPasteHTML', svgAttributes, svgInnerHTML);

export default PasteHTML;
