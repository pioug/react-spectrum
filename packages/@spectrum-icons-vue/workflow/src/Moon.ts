import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm1,29.964c-.33.023-.664.036-1,.036A14,14,0,0,1,18,4c.336,0,.67.013,1,.036a22,22,0,0,0,0,27.928Z"></path>`;

const Moon = createWorkflowIcon('VueWorkflowMoon', svgAttributes, svgInnerHTML);

export default Moon;
