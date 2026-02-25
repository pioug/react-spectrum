import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="36" width="2" x="31"></rect><path fill-rule="evenodd" d="M25.588,31.7,15.633,4.21c-.041-.169-.082-.21-.251-.21H11.229a.2.2,0,0,0-.21.21,4.564,4.564,0,0,1-.3,1.739L1.485,31.662c-.041.21.045.338.255.338H4.62a.3.3,0,0,0,.338-.255L8.09,23H18.7l3.161,8.79A.376.376,0,0,0,22.2,32h3.218C25.632,32,25.674,31.872,25.588,31.7ZM13.347,6.88h.041c.759,2.707,3.355,9.972,4.44,13.12H8.958C10.548,15.416,12.662,9.454,13.347,6.88Z"></path>`;

const Rename = createWorkflowIcon('VueWorkflowRename', svgAttributes, svgInnerHTML);

export default Rename;
