import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM30,18a11.943,11.943,0,0,1-2.219,6.953L11.047,8.219A12,12,0,0,1,30,18ZM6,18a11.945,11.945,0,0,1,2.219-6.953L24.953,27.782A12,12,0,0,1,6,18Z"></path>`;

const Cancel = createWorkflowIcon('VueWorkflowCancel', svgAttributes, svgInnerHTML);

export default Cancel;
