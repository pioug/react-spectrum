import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2.323c-8.6,0-15.578,6.609-15.578,14.761A14.336,14.336,0,0,0,7.091,27.6v7.562l6.675-3.872A16.414,16.414,0,0,0,18,31.845c8.6,0,15.578-6.609,15.578-14.761S26.6,2.323,18,2.323Zm1.639,19.713L15.59,17.882,8.2,22l8.167-8.942,4.083,3.978,7.463-4.048Z"></path>`;

const Messenger = createWorkflowIcon('VueWorkflowMessenger', svgAttributes, svgInnerHTML);

export default Messenger;
