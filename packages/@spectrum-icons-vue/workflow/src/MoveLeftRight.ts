import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6.311,10.483A1,1,0,0,1,8,11.2V14h6v6H8v2.778a1.006,1.006,0,0,1-1.707.722L0,17Z"></path><path fill-rule="evenodd" d="M29.707,10.5A1.006,1.006,0,0,0,28,11.222V14H22v6h6v2.8a1,1,0,0,0,1.689.715L36,17Z"></path><rect fill-rule="evenodd" height="30" rx="1" ry="1" width="4" x="16" y="2"></rect>`;

const MoveLeftRight = createWorkflowIcon('VueWorkflowMoveLeftRight', svgAttributes, svgInnerHTML);

export default MoveLeftRight;
