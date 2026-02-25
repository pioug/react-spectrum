import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="10 2 10 12 0 12 10 2"></polygon><path fill-rule="evenodd" d="M33,8H19a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9A1,1,0,0,0,33,8Zm-8,2h2a1,1,0,0,1,0,2H25a1,1,0,0,1,0-2Zm1,23.1A2.1,2.1,0,1,1,28.1,31,2.1,2.1,0,0,1,26,33.1ZM32,28H20V14H32Z"></path><path fill-rule="evenodd" d="M16,32V8.481A2.481,2.481,0,0,1,18.481,6H26V3a1,1,0,0,0-1-1H12V13a1,1,0,0,1-1,1H0V33a1,1,0,0,0,1,1H16.557A3.953,3.953,0,0,1,16,32Z"></path>`;

const FileMobile = createWorkflowIcon('VueWorkflowFileMobile', svgAttributes, svgInnerHTML);

export default FileMobile;
