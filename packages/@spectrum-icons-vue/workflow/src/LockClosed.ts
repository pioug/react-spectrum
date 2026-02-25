import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,16H28V14A10,10,0,0,0,8,14v2H7a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V17A1,1,0,0,0,29,16ZM12,14a6,6,0,0,1,12,0v2H12Zm8,12.222V29a1,1,0,0,1-1,1H17a1,1,0,0,1-1-1V26.222a3,3,0,1,1,4,0Z"></path>`;

const LockClosed = createWorkflowIcon('VueWorkflowLockClosed', svgAttributes, svgInnerHTML);

export default LockClosed;
