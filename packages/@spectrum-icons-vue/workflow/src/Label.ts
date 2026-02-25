import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.293,19.292l-17-17A1,1,0,0,0,17.586,2H3A1,1,0,0,0,2,3V17.585a1,1,0,0,0,.293.708l17,17a1,1,0,0,0,1.414,0L35.293,20.707A1,1,0,0,0,35.293,19.292ZM8,10.6A2.6,2.6,0,1,1,10.6,8,2.6,2.6,0,0,1,8,10.6Z"></path>`;

const Label = createWorkflowIcon('VueWorkflowLabel', svgAttributes, svgInnerHTML);

export default Label;
