import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="14" y="8"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="14" y="14"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="14" y="2"></rect><path fill-rule="evenodd" d="M4,33.328a.5.5,0,0,0,.866.341L10,28,4.866,22.331A.5.5,0,0,0,4,22.672Z"></path><path fill-rule="evenodd" d="M34,33V23a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33A1,1,0,0,0,34,33Zm-2-1H16V24H32Z"></path>`;

const TextSpaceAfter = createWorkflowIcon('VueWorkflowTextSpaceAfter', svgAttributes, svgInnerHTML);

export default TextSpaceAfter;
