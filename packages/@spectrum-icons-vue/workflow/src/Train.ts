import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,0H6A4,4,0,0,0,2,4V24a4,4,0,0,0,4,4H9.9762L6.50952,36H9.1571l.8667-2H25.9762l.8667,2h2.64758L26.0238,28H30a4,4,0,0,0,4-4V4A3.99988,3.99988,0,0,0,30,0ZM8,25a3,3,0,1,1,3-3A3.00006,3.00006,0,0,1,8,25Zm2.8905,7,1.73328-4H23.37622l1.7334,4ZM7,16a1,1,0,0,1-1-1V4H30V15a1,1,0,0,1-1,1Zm21,9a3,3,0,1,1,3-3A3.00006,3.00006,0,0,1,28,25Z"></path>`;

const Train = createWorkflowIcon('VueWorkflowTrain', svgAttributes, svgInnerHTML);

export default Train;
