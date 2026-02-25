import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14ZM14.567,29.225a.257.257,0,0,1-.209.408H11.614a.257.257,0,0,1-.206-.1L7.947,24.915,11.408,20.3a.256.256,0,0,1,.206-.1h2.744a.257.257,0,0,1,.209.407l-3.505,4.31Zm2.766,1.844H15.467a.514.514,0,0,1-.495-.652l3.745-13.412a.515.515,0,0,1,.5-.376H21.08a.514.514,0,0,1,.495.652L17.828,30.694A.514.514,0,0,1,17.334,31.07Zm7.258-1.539a.26.26,0,0,1-.206.1H21.642a.257.257,0,0,1-.209-.408l3.505-4.31-3.505-4.31a.257.257,0,0,1,.209-.407h2.744a.259.259,0,0,1,.206.1l3.461,4.615Z"></path>`;

const FileCode = createWorkflowIcon('VueWorkflowFileCode', svgAttributes, svgInnerHTML);

export default FileCode;
