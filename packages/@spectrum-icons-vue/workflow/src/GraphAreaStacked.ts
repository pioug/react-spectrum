import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.371,16.321,34,23.578v9a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1v-15l10,12L15.584,24.2a.5.5,0,0,1,.832,0L20,29.578l9.517-13.324A.5.5,0,0,1,30.371,16.321Z"></path><path fill-rule="evenodd" d="M11.769,25.239l2.151-3.227a2.5,2.5,0,0,1,4.16,0L20.074,25,27.98,13.933a2.5,2.5,0,0,1,4.271.335L34,17.765V7.578L30.43,2.223a.5.5,0,0,0-.84.012L20,17.578,16.416,12.2a.5.5,0,0,0-.832,0L12,17.578l-10-10v5.938Z"></path>`;

const GraphAreaStacked = createWorkflowIcon('VueWorkflowGraphAreaStacked', svgAttributes, svgInnerHTML);

export default GraphAreaStacked;
