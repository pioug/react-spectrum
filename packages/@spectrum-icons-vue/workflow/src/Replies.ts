import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M21.947,6.059V2.878a.636.636,0,0,0-1.086-.45L13.674,9.877l7.186,7.449a.636.636,0,0,0,1.086-.45V13.647a11.687,11.687,0,0,1,11.916,4.632.45.45,0,0,0,.811-.26C34.674,16.1,32.482,6.059,21.947,6.059Z"></path><path fill-rule="evenodd" d="M11.975,18V14.251a.75.75,0,0,0-1.28-.53L2.225,22.5l8.47,8.779a.75.75,0,0,0,1.28-.53v-3.8A13.773,13.773,0,0,1,26.019,32.4a.531.531,0,0,0,.956-.307C26.975,29.832,24.391,18,11.975,18Z"></path>`;

const Replies = createWorkflowIcon('VueWorkflowReplies', svgAttributes, svgInnerHTML);

export default Replies;
