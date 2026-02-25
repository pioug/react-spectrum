import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM10,25.017V10.984a1,1,0,0,1,1.625-.781L14,12.1V23.9l-2.375,1.9A1,1,0,0,1,10,25.017Zm18.4-6.236L19.625,25.8A1,1,0,0,1,18,25.017V10.984a1,1,0,0,1,1.625-.781L28.4,17.22A1,1,0,0,1,28.4,18.781Z"></path>`;

const FastForwardCircle = createWorkflowIcon('VueWorkflowFastForwardCircle', svgAttributes, svgInnerHTML);

export default FastForwardCircle;
