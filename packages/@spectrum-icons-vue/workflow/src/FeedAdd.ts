import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.74,28H6V22h9.76a12.256,12.256,0,0,1,1.126-2H6V14H30v1.069a12.216,12.216,0,0,1,2,.69V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V29a1,1,0,0,0,1,1H15.069A12.246,12.246,0,0,1,14.74,28ZM6,6H30v6H6Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const FeedAdd = createWorkflowIcon('VueWorkflowFeedAdd', svgAttributes, svgInnerHTML);

export default FeedAdd;
