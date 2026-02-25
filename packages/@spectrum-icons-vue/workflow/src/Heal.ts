import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32.728,3.272a6,6,0,0,0-8.485,0L17.787,9.728,3.272,24.243a6,6,0,0,0,8.485,8.485L17.7,26.781,32.728,11.757a6,6,0,0,0,0-8.485ZM19,11a2,2,0,1,1-2,2A2,2,0,0,1,19,11ZM13,21a2,2,0,1,1,2-2A2,2,0,0,1,13,21Zm4,4a2,2,0,1,1,2-2A2,2,0,0,1,17,25Zm6-6a2,2,0,1,1,2-2A2,2,0,0,1,23,19Z"></path>`;

const Heal = createWorkflowIcon('VueWorkflowHeal', svgAttributes, svgInnerHTML);

export default Heal;
