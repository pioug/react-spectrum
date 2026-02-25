import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.9,27A8.9,8.9,0,1,0,27,35.9,8.9,8.9,0,0,0,35.9,27Zm-3.863-2.171-4.614,7.3a.5.5,0,0,1-.845,0l-4.614-7.3A.5.5,0,0,1,22.34,24h9.321A.5.5,0,0,1,32.037,24.829Z"></path><path fill-rule="evenodd" d="M16,27.1V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5v6a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V8h8V28H9a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h8.172A10.82,10.82,0,0,1,16,27.1Z"></path>`;

const TextDecrease = createWorkflowIcon('VueWorkflowTextDecrease', svgAttributes, svgInnerHTML);

export default TextDecrease;
