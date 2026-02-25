import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM12.365,8.534c1.656,0,3,1.679,3,3.75s-1.344,3.75-3,3.75-3-1.679-3-3.75S10.708,8.534,12.365,8.534Zm11.108-.1c1.657,0,3,1.679,3,3.75s-1.343,3.75-3,3.75-3-1.679-3-3.75S21.816,8.432,23.473,8.432ZM18,28.04c-5.033,0-9.556-3.633-10-8.14H28C27.556,24.407,23.033,28.04,18,28.04Z"></path>`;

const SentimentPositive = createWorkflowIcon('VueWorkflowSentimentPositive', svgAttributes, svgInnerHTML);

export default SentimentPositive;
