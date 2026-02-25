import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25,26H23a1,1,0,0,0-1,1v3H6V6H22V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V27A1,1,0,0,0,25,26Z"></path><path fill-rule="evenodd" d="M35.856,17.649,29.332,10.2a.787.787,0,0,0-.527-.2.8.8,0,0,0-.8.8V16H17a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H28v5.2a.8.8,0,0,0,.8.8.787.787,0,0,0,.527-.2l6.524-7.445a.5.5,0,0,0,0-.7Z"></path>`;

const Export = createWorkflowIcon('VueWorkflowExport', svgAttributes, svgInnerHTML);

export default Export;
