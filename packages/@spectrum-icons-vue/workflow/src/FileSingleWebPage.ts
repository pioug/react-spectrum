import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M12,28H24V22H12Zm7-14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm7,15a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V19a1,1,0,0,1,1-1H25a1,1,0,0,1,1,1Z"></path>`;

const FileSingleWebPage = createWorkflowIcon('VueWorkflowFileSingleWebPage', svgAttributes, svgInnerHTML);

export default FileSingleWebPage;
