import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm-5.635,8.534c1.656,0,3,1.679,3,3.75s-1.344,3.75-3,3.75-3-1.679-3-3.75S10.708,10.534,12.365,10.534ZM23.2,26H12.8a.8.8,0,0,1-.8-.8v-.4a.8.8,0,0,1,.8-.8H23.2a.8.8,0,0,1,.8.8v.4A.8.8,0,0,1,23.2,26Zm.273-8.068c-1.657,0-3-1.679-3-3.75s1.343-3.75,3-3.75,3,1.679,3,3.75S25.13,17.932,23.473,17.932Z"></path>`;

const SentimentNeutral = createWorkflowIcon('VueWorkflowSentimentNeutral', svgAttributes, svgInnerHTML);

export default SentimentNeutral;
