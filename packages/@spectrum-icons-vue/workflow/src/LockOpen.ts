import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,16H11.9V10.352A6.213,6.213,0,0,1,18,4a6.142,6.142,0,0,1,5.507,3.419c.31.639.266,1.146.777,1.146a.508.508,0,0,0,.186-.036L27.152,7.46a.514.514,0,0,0,.322-.471C27.474,5.513,24.167.2,18,.2,11.143.2,8,6.505,8,10.292V16H7a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V17A1,1,0,0,0,29,16ZM20,26.222V29a1,1,0,0,1-1,1H17a1,1,0,0,1-1-1V26.222a3,3,0,1,1,4,0Z"></path>`;

const LockOpen = createWorkflowIcon('VueWorkflowLockOpen', svgAttributes, svgInnerHTML);

export default LockOpen;
