import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,.1A8.9,8.9,0,1,0,35.9,9,8.9,8.9,0,0,0,27,.1ZM29.684,14H24.053c-.127,0-.163-.054-.145-.163L23.9,11.981a.174.174,0,0,1,.2-.163H25.78l0-5.447a15.522,15.522,0,0,1-1.953.507c-.126.018-.163-.018-.163-.127V5.177c0-.091.019-.145.127-.163a11.585,11.585,0,0,0,2.339-.924A.667.667,0,0,1,26.441,4H27.92c.091,0,.109.054.109.127l0,7.691h1.619c.127,0,.163.055.181.163l0,1.82C29.846,13.946,29.792,14,29.684,14Z"></path><path fill-rule="evenodd" d="M27,21.3A12.3,12.3,0,0,1,14.7,9c0-.338.024-.669.05-1H4a2,2,0,0,0-2,2V32a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V21.25C27.669,21.276,27.338,21.3,27,21.3Z"></path>`;

const PushNotification = createWorkflowIcon('VueWorkflowPushNotification', svgAttributes, svgInnerHTML);

export default PushNotification;
