import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M21.879,20.344a1,1,0,0,1-1.414,0l-4.809-4.809a1,1,0,0,1,0-1.414L23.777,6H3A1,1,0,0,0,2,7V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V12.223Z"></path><path fill-rule="evenodd" d="M23.707,2a.5.5,0,0,0-.353.854l3.482,3.482L18.7,14.475a.5.5,0,0,0,0,.707L20.818,17.3a.5.5,0,0,0,.707,0l8.139-8.139,3.482,3.483A.5.5,0,0,0,34,12.293V2Z"></path>`;

const MoveTo = createWorkflowIcon('VueWorkflowMoveTo', svgAttributes, svgInnerHTML);

export default MoveTo;
