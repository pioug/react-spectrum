import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,12.00018a5.99982,5.99982,0,1,0,6,5.99964A6.0068,6.0068,0,0,0,18,12.00018Z"></path><path fill-rule="evenodd" d="M33,8.00024H26.95007L23.59753,4.32617a1.00072,1.00072,0,0,0-.73877-.32593H13.14124a1.00072,1.00072,0,0,0-.73877.32593L9.05005,8.00024H3a1.00005,1.00005,0,0,0-1,1v20a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1v-20A1.00005,1.00005,0,0,0,33,8.00024ZM18,26.19978a8.19978,8.19978,0,1,1,8.20007-8.19993A8.20007,8.20007,0,0,1,18,26.19978Z"></path>`;

const Camera = createWorkflowIcon('VueWorkflowCamera', svgAttributes, svgInnerHTML);

export default Camera;
