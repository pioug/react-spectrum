import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="18" r="4.3"></circle><path fill-rule="evenodd" d="M6.227,20.311H2A16.172,16.172,0,0,0,15.688,34V29.773A12.007,12.007,0,0,1,6.227,20.311Z"></path><path fill-rule="evenodd" d="M29.773,20.311a12.007,12.007,0,0,1-9.461,9.462V34A16.172,16.172,0,0,0,34,20.311Z"></path><path fill-rule="evenodd" d="M15.688,6.228V2A16.171,16.171,0,0,0,2,15.688H6.228A12,12,0,0,1,15.688,6.228Z"></path><path fill-rule="evenodd" d="M29.772,15.688H34A16.171,16.171,0,0,0,20.312,2V6.228A12,12,0,0,1,29.772,15.688Z"></path>`;

const Campaign = createWorkflowIcon('VueWorkflowCampaign', svgAttributes, svgInnerHTML);

export default Campaign;
