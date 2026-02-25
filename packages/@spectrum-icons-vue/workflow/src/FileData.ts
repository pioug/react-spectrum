import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="16 2 16 12 6 12 16 2"></polygon><path fill-rule="evenodd" d="M20,34V17.861c0-3.3,4.666-4.8,9-4.8.332,0,.666.025,1,.043V3a1,1,0,0,0-1-1H18V13a1,1,0,0,1-1,1H6V33a1,1,0,0,0,1,1Z"></path><path fill-rule="evenodd" d="M29,28c-3.866,0-7-1.253-7-2.8v-4c0,1.546,3.134,3.066,7,3.066s7-1.52,7-3.066v4C36,26.747,32.866,28,29,28Zm7,5.179V28.021c0,1.546-3.134,2.8-7,2.8s-7-1.253-7-2.8v5.159c0,1.546,3.134,2.8,7,2.8S36,34.726,36,33.179Zm0-15.068c0-1.546-3.195-2.626-7.061-2.626S22,16.565,22,18.111s3.134,2.8,7,2.8S36,19.658,36,18.111Z"></path>`;

const FileData = createWorkflowIcon('VueWorkflowFileData', svgAttributes, svgInnerHTML);

export default FileData;
