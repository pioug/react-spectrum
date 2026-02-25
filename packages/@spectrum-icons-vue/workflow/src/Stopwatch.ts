import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,2h1a1,1,0,0,0,0-2H17a1,1,0,0,0,0,2h1V4h2Z"></path><path fill-rule="evenodd" d="M19,4A14.94,14.94,0,0,0,9.1,7.729L7.437,6.062l.708-.707A1,1,0,1,0,6.73,3.941l-.707.707L4.609,6.062,3.9,6.77A1,1,0,0,0,5.316,8.184l.707-.707L7.692,9.145A15,15,0,1,0,19,4Zm0,28A13,13,0,1,1,26.833,8.625L17.908,17.55c-.021.021-.037.04-.057.062a1.858,1.858,0,1,0,2.619,2.635c.023-.021.046-.045.068-.067l8.913-8.912A13,13,0,0,1,19,32Z"></path>`;

const Stopwatch = createWorkflowIcon('VueWorkflowStopwatch', svgAttributes, svgInnerHTML);

export default Stopwatch;
