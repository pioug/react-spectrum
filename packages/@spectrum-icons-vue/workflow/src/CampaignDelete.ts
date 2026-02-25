import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4.227,20.311H0A16.172,16.172,0,0,0,13.688,34V29.772A12.006,12.006,0,0,1,4.227,20.311Z"></path><path fill-rule="evenodd" d="M13.688,6.228V2A16.172,16.172,0,0,0,0,15.688H4.228A12.005,12.005,0,0,1,13.688,6.228Z"></path><path fill-rule="evenodd" d="M27.772,15.688H32A16.172,16.172,0,0,0,18.312,2V6.228A12.005,12.005,0,0,1,27.772,15.688Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M20.112,16.809a4.289,4.289,0,1,0-4.465,5.455A12.344,12.344,0,0,1,20.112,16.809Z"></path>`;

const CampaignDelete = createWorkflowIcon('VueWorkflowCampaignDelete', svgAttributes, svgInnerHTML);

export default CampaignDelete;
