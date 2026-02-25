import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" width="12" x="6" y="22"></rect><rect fill-rule="evenodd" height="4" width="4" x="20" y="22"></rect><rect fill-rule="evenodd" height="4" width="4" x="26" y="22"></rect><rect fill-rule="evenodd" height="6" width="24" x="6" y="14"></rect><path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4ZM4,28V10H32V28Z"></path>`;

const Homepage = createWorkflowIcon('VueWorkflowHomepage', svgAttributes, svgInnerHTML);

export default Homepage;
