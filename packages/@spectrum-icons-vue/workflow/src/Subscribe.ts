import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="24.779 21.963 36 30.367 36 17.333 36 13.541 24.779 21.963"></polygon><path fill-rule="evenodd" d="M22.866,23.4,19.29,26.094a2.172,2.172,0,0,1-2.58,0l-3.628-2.719L0,33.068A.981.981,0,0,0,1,34H35a.884.884,0,0,0,1-.756Z"></path><polygon fill-rule="evenodd" points="11.165 21.938 0 13.511 0 17.333 0 30.195 11.165 21.938"></polygon><path fill-rule="evenodd" d="M19.067.672a2,2,0,0,0-2.133,0L0,11.365V14H6V9A1,1,0,0,1,7,8H29a1,1,0,0,1,1,1v5h6V11.335Z"></path><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="16" x="10" y="12"></rect><path fill-rule="evenodd" d="M21.83,20H14.17a.5.5,0,0,1-.3-.1l-1.882-1.448A.25.25,0,0,1,12.135,18h11.73a.25.25,0,0,1,.152.448L22.135,19.9A.5.5,0,0,1,21.83,20Z"></path>`;

const Subscribe = createWorkflowIcon('VueWorkflowSubscribe', svgAttributes, svgInnerHTML);

export default Subscribe;
