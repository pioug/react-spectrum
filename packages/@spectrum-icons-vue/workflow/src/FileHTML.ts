import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm7.888,16.4h-2.8v-4h-3.2v4h-2.8V19.6h2.8v4h3.2v-4h2.8ZM15.935,29.31a.257.257,0,0,1-.209.407H12.982a.256.256,0,0,1-.206-.1L9.315,25l3.461-4.615a.256.256,0,0,1,.206-.1h2.744a.257.257,0,0,1,.209.407L12.43,25Z"></path>`;

const FileHTML = createWorkflowIcon('VueWorkflowFileHTML', svgAttributes, svgInnerHTML);

export default FileHTML;
