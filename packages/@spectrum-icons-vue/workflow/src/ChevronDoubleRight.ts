import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,18v0a1.988,1.988,0,0,1-.585,1.409l-7.983,7.98a2,2,0,1,1-2.871-2.772l.049-.049L25.181,18l-6.572-6.57a2,2,0,0,1,2.773-2.87l.049.049,7.983,7.98A1.988,1.988,0,0,1,30,18Z"></path><path fill-rule="evenodd" d="M18,18v0a1.988,1.988,0,0,1-.585,1.409l-7.983,7.98A2,2,0,1,1,6.56,24.619l.049-.049L13.181,18,6.609,11.43A2,2,0,0,1,9.383,8.56l.049.049,7.983,7.98A1.988,1.988,0,0,1,18,18Z" data-name="S_MillerColumnsChevronPrevious"></path>`;

const ChevronDoubleRight = createWorkflowIcon('VueWorkflowChevronDoubleRight', svgAttributes, svgInnerHTML);

export default ChevronDoubleRight;
