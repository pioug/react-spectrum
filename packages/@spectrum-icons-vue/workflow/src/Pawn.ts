import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="0.894" ry="0.894" width="24" x="6" y="32"></rect><path fill-rule="evenodd" d="M25.184,12H21.31a6,6,0,1,0-6.619,0H10.816a.816.816,0,0,0-.816.816v2.367a.816.816,0,0,0,.816.816H15L12,30H24L21,16h4.184A.816.816,0,0,0,26,15.184V12.816A.816.816,0,0,0,25.184,12Z"></path>`;

const Pawn = createWorkflowIcon('VueWorkflowPawn', svgAttributes, svgInnerHTML);

export default Pawn;
