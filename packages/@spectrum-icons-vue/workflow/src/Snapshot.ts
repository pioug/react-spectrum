import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,7.5V6H18v6h2V10.5a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5v5a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5V14H18a2,2,0,0,1-2-2V6a2,2,0,0,1,2-2h2V2.5a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5v5a.5.5,0,0,1-.5.5h-15A.5.5,0,0,1,20,7.5ZM14.927,26.52c-1.13-.1-1.148-1.009-1.148-2.145a10.338,10.338,0,0,0,2.428-6.159c0-3.73-2.123-6.216-5.178-6.216S5.85,14.486,5.85,18.216a10.339,10.339,0,0,0,2.429,6.159c0,1.136-.018,2.046-1.151,2.145C5.58,26.657.517,28.338.062,33.275A.686.686,0,0,0,.711,34H21.305a.688.688,0,0,0,.689-.687v-.038C21.538,28.338,16.475,26.655,14.927,26.52Z"></path>`;

const Snapshot = createWorkflowIcon('VueWorkflowSnapshot', svgAttributes, svgInnerHTML);

export default Snapshot;
