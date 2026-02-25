import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M11.118,14H34.882A1.119,1.119,0,0,0,36,12.882V5.118A1.118,1.118,0,0,0,34.882,4H11.118A1.118,1.118,0,0,0,10,5.118V8H6a2,2,0,0,0-2,2v3.1a5,5,0,0,0,0,9.8V26a2,2,0,0,0,2,2h4v2.882A1.119,1.119,0,0,0,11.118,32H34.882A1.119,1.119,0,0,0,36,30.882V23.118A1.118,1.118,0,0,0,34.882,22H11.118A1.118,1.118,0,0,0,10,23.118V26H6V22.9a5,5,0,0,0,0-9.8V10h4v2.882A1.119,1.119,0,0,0,11.118,14ZM8,18a3,3,0,1,1-3-3A3,3,0,0,1,8,18Z"></path>`;

const Segments = createWorkflowIcon('VueWorkflowSegments', svgAttributes, svgInnerHTML);

export default Segments;
