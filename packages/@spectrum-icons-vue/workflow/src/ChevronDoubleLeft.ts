import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,18v0a1.988,1.988,0,0,0,.585,1.409l7.983,7.98a2,2,0,1,0,2.871-2.772l-.049-.049L10.819,18l6.572-6.57a2,2,0,0,0-2.773-2.87l-.049.049-7.983,7.98A1.988,1.988,0,0,0,6,18Z"></path><path fill-rule="evenodd" d="M18,18v0a1.988,1.988,0,0,0,.585,1.409l7.983,7.98a2,2,0,1,0,2.871-2.772l-.049-.049L22.819,18l6.572-6.57a2,2,0,0,0-2.773-2.87l-.049.049-7.983,7.98A1.988,1.988,0,0,0,18,18Z" data-name="S_MillerColumnsChevronPrevious"></path>`;

const ChevronDoubleLeft = createWorkflowIcon('VueWorkflowChevronDoubleLeft', svgAttributes, svgInnerHTML);

export default ChevronDoubleLeft;
