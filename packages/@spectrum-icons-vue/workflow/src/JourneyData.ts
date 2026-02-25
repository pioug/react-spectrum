import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,28c-3.866,0-7-1.253-7-2.8v-4c0,1.546,3.134,3.066,7,3.066s7-1.52,7-3.066v4C36,26.747,32.866,28,29,28Zm7,5.179V28.021c0,1.546-3.134,2.8-7,2.8s-7-1.253-7-2.8V33.18c0,1.546,3.134,2.8,7,2.8S36,34.726,36,33.179Zm0-15.068c0-1.546-3.195-2.626-7.061-2.626S22,16.565,22,18.111s3.134,2.8,7,2.8S36,19.658,36,18.111Z"></path><path fill-rule="evenodd" d="M20,28a2,2,0,0,1-2-2V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16v8a4,4,0,0,0,4,4ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20Z"></path>`;

const JourneyData = createWorkflowIcon('VueWorkflowJourneyData', svgAttributes, svgInnerHTML);

export default JourneyData;
