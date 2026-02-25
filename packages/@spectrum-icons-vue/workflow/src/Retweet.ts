import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,24V14h2a.5.5,0,0,0,.4-.8L9,6,3.6,13.2A.5.5,0,0,0,4,14H6V24a6,6,0,0,0,6,6H24l-4.759-6Z"></path><path fill-rule="evenodd" d="M32,22H30V12a6,6,0,0,0-6-6H12l4.735,6H24V22H22a.5.5,0,0,0-.4.8L27,30l5.4-7.2A.5.5,0,0,0,32,22Z"></path>`;

const Retweet = createWorkflowIcon('VueWorkflowRetweet', svgAttributes, svgInnerHTML);

export default Retweet;
