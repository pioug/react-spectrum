import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,2.728V9.918a.489.489,0,0,0,.353.466,7.96,7.96,0,0,1,0,15.234.489.489,0,0,0-.353.466v7.189a.513.513,0,0,0,.587.506,15.986,15.986,0,0,0,0-31.555A.513.513,0,0,0,20,2.728Z"></path><path fill-rule="evenodd" d="M12.959,11.827a8.036,8.036,0,0,1,2.69-1.444A.486.486,0,0,0,16,9.92V2.729a.514.514,0,0,0-.587-.506A15.977,15.977,0,0,0,6.3,7.111a.511.511,0,0,0,.1.767L12.38,11.86A.485.485,0,0,0,12.959,11.827Z"></path><path fill-rule="evenodd" d="M10,18a7.914,7.914,0,0,1,.333-2.275.486.486,0,0,0-.193-.551L4.168,11.2a.513.513,0,0,0-.748.206A15.989,15.989,0,0,0,15.413,33.777.513.513,0,0,0,16,33.271V26.083a.489.489,0,0,0-.353-.466A7.977,7.977,0,0,1,10,18Z"></path>`;

const GraphDonut = createWorkflowIcon('VueWorkflowGraphDonut', svgAttributes, svgInnerHTML);

export default GraphDonut;
