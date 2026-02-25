import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="16" cy="18" r="4.3"></circle><path fill-rule="evenodd" d="M4.227,20.311H0A16.172,16.172,0,0,0,13.688,34V29.772A12.006,12.006,0,0,1,4.227,20.311Z"></path><path fill-rule="evenodd" d="M13.688,6.228V2A16.172,16.172,0,0,0,0,15.688H4.228A12.005,12.005,0,0,1,13.688,6.228Z"></path><path fill-rule="evenodd" d="M27.772,15.688H32A16.172,16.172,0,0,0,18.312,2V6.228A12.005,12.005,0,0,1,27.772,15.688Z"></path><path fill-rule="evenodd" d="M35.738,21.764l-3.506-3.506a.738.738,0,0,0-.527-.215h-.023a.833.833,0,0,0-.564.247L20.929,28.48a.607.607,0,0,0-.153.256l-2.66,6.63c-.069.229.279.517.476.517a.313.313,0,0,0,.037,0c.168-.039,5.756-2.4,6.634-2.661a.6.6,0,0,0,.252-.151l10.19-10.19a.836.836,0,0,0,.246-.537A.743.743,0,0,0,35.738,21.764Zm-10.97,10.33c-1.314.4-3.928,1.862-5.063,2.2L21.9,29.232Z"></path>`;

const CampaignEdit = createWorkflowIcon('VueWorkflowCampaignEdit', svgAttributes, svgInnerHTML);

export default CampaignEdit;
