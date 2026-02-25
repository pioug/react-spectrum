import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,2h.086a1,1,0,0,1,.707.293l8.914,8.914a1,1,0,0,1,.293.707V12H20Z"></path><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm6.986,18H10.026c-.01-.121-.026-.6-.026-.727,0-1.105.7-3.908,5.173-4.265a.723.723,0,0,0,.668-.707V25.285a.673.673,0,0,0-.2-.455A6.345,6.345,0,0,1,13.8,21.25a4.359,4.359,0,0,1,4.185-4.45A4.347,4.347,0,0,1,22.2,21.25a6.358,6.358,0,0,1-1.853,3.58.678.678,0,0,0-.2.455v1.021a.726.726,0,0,0,.666.706c4.393.409,5.183,3.2,5.183,4.261C26,31.4,25.986,32,25.986,32Z"></path>`;

const UserActivity = createWorkflowIcon('VueWorkflowUserActivity', svgAttributes, svgInnerHTML);

export default UserActivity;
