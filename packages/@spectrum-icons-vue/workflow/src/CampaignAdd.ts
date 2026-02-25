import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6.227,20.311H2A16.172,16.172,0,0,0,15.688,34V29.772A12.006,12.006,0,0,1,6.227,20.311Z"></path><path fill-rule="evenodd" d="M15.688,6.228V2A16.172,16.172,0,0,0,2,15.688H6.228A12.005,12.005,0,0,1,15.688,6.228Z"></path><path fill-rule="evenodd" d="M29.772,15.688H34A16.172,16.172,0,0,0,20.312,2V6.228A12.005,12.005,0,0,1,29.772,15.688Z"></path><path fill-rule="evenodd" d="M15.9,21.73A12.329,12.329,0,0,1,21.73,15.9,4.286,4.286,0,1,0,15.9,21.73Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const CampaignAdd = createWorkflowIcon('VueWorkflowCampaignAdd', svgAttributes, svgInnerHTML);

export default CampaignAdd;
