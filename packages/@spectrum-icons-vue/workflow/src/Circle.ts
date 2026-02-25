import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6.68,29.32a16,16,0,1,1,22.64,0A16,16,0,0,1,6.68,29.32ZM27.904,8.096a14,14,0,1,0,0,19.8A14,14,0,0,0,27.904,8.096Z"></path>`;

const Circle = createWorkflowIcon('VueWorkflowCircle', svgAttributes, svgInnerHTML);

export default Circle;
