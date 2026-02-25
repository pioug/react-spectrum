import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.522,8.775,29.06,2.312a1.5,1.5,0,0,0-2.122,0L13.177,16.073A8.9,8.9,0,0,0,9,15a9,9,0,1,0,9,9,8.9,8.9,0,0,0-1.049-4.133l6.726-6.726,3.74,3.74a.75.75,0,0,0,1.061,0l3.344-3.344-4.27-4.271,1.231-1.231,4.27,4.271,2.469-2.47A.75.75,0,0,0,35.522,8.775ZM7.5,28.5a3,3,0,1,1,3-3A3,3,0,0,1,7.5,28.5Z"></path>`;

const Key = createWorkflowIcon('VueWorkflowKey', svgAttributes, svgInnerHTML);

export default Key;
