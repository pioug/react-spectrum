import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,12.661V2.73a.515.515,0,0,0-.588-.507A15.952,15.952,0,0,0,7.028,6.386a.511.511,0,0,0,.057.779l8.121,5.9A.5.5,0,0,0,16,12.661Zm4-9.932V33.271a.513.513,0,0,0,.587.506,15.986,15.986,0,0,0,0-31.555A.513.513,0,0,0,20,2.729ZM2,18A15.993,15.993,0,0,0,15.413,33.777.513.513,0,0,0,16,33.271V19.707a.5.5,0,0,0-.206-.4L4.31,10.959a.51.51,0,0,0-.756.184A15.872,15.872,0,0,0,2,18Z"></path>`;

const GraphPie = createWorkflowIcon('VueWorkflowGraphPie', svgAttributes, svgInnerHTML);

export default GraphPie;
