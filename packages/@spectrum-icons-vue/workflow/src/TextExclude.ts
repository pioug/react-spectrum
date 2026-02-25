import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.935,6.935,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.526,4.252-9.778-9.777a6.966,6.966,0,0,1,9.778,9.777Z"></path><path fill-rule="evenodd" d="M16.04,28S16,26.984,16,26V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5v6a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V8h8V28H9a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h8.21A10.934,10.934,0,0,1,16.04,28Z"></path>`;

const TextExclude = createWorkflowIcon('VueWorkflowTextExclude', svgAttributes, svgInnerHTML);

export default TextExclude;
