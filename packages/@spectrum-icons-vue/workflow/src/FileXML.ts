import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm7.069,16.752H24.138a.612.612,0,0,1-.59-.344s-1.41-2.4-1.908-3.271c-.6,1.1-1.215,2.213-1.83,3.289a.566.566,0,0,1-.533.325H17.438a.476.476,0,0,1-.406-.725l2.94-4.8L17.1,20.469a.476.476,0,0,1,.407-.723H19.4a.67.67,0,0,1,.584.342l1.8,3.2L23.49,20.1a.67.67,0,0,1,.59-.353h1.786a.476.476,0,0,1,.406.724l-2.83,4.63,3.032,4.926A.476.476,0,0,1,26.069,30.752ZM14.62,29.028a.257.257,0,0,1-.209.408H11.667a.257.257,0,0,1-.206-.1L8,24.718,11.461,20.1a.256.256,0,0,1,.206-.1h2.744a.257.257,0,0,1,.209.407l-3.505,4.31Z"></path>`;

const FileXML = createWorkflowIcon('VueWorkflowFileXML', svgAttributes, svgInnerHTML);

export default FileXML;
