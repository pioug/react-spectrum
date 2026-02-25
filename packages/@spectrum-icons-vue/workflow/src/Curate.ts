import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,4H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4ZM34,30H2V24h9.663a3.477,3.477,0,0,0,6.674,0h1.326a3.477,3.477,0,0,0,6.674,0H34Zm0-8H26.337a3.477,3.477,0,0,0-6.674,0H18.337a3.477,3.477,0,0,0-6.674,0H2V14H3.663a3.477,3.477,0,0,0,6.674,0h1.326a3.477,3.477,0,0,0,6.674,0h7.326a3.477,3.477,0,0,0,6.674,0H34Zm0-10H32.337a3.477,3.477,0,0,0-6.674,0H18.337a3.477,3.477,0,0,0-6.674,0H10.337a3.477,3.477,0,0,0-6.674,0H2V6H34Z"></path>`;

const Curate = createWorkflowIcon('VueWorkflowCurate', svgAttributes, svgInnerHTML);

export default Curate;
