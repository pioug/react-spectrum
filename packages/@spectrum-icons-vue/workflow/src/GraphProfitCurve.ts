import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2.513,2.006A.51.51,0,0,0,2,2.514v1a.5.5,0,0,0,.492.493A28.07,28.07,0,0,1,22.036,12H20v2h3.89a30.937,30.937,0,0,1,7.1,19.512.494.494,0,0,0,.493.49h1a.508.508,0,0,0,.507-.512C32.745,16.791,20.308,2.28,2.513,2.006Z"></path><rect fill-rule="evenodd" height="4" width="2" x="22" y="28"></rect><rect fill-rule="evenodd" height="4" width="2" x="22" y="22"></rect><rect fill-rule="evenodd" height="4" width="2" x="22" y="16"></rect><rect fill-rule="evenodd" height="2" width="4" x="14" y="12"></rect><rect fill-rule="evenodd" height="2" width="4" x="8" y="12"></rect><rect fill-rule="evenodd" height="2" width="4" x="2" y="12"></rect>`;

const GraphProfitCurve = createWorkflowIcon('VueWorkflowGraphProfitCurve', svgAttributes, svgInnerHTML);

export default GraphProfitCurve;
