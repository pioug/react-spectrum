import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M16.5,27A10.5,10.5,0,0,1,27,16.5a10.4,10.4,0,0,1,3,.488V14H19a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H19.225A10.424,10.424,0,0,1,16.5,27Z"></path><path fill-rule="evenodd" d="M19.022,26h2.762A5.307,5.307,0,0,1,26,21.784V19.022A8.119,8.119,0,0,0,19.022,26Zm13.193,0h2.762A8.119,8.119,0,0,0,28,19.022v2.761A5.307,5.307,0,0,1,32.216,26ZM21.784,28H19.022A8.119,8.119,0,0,0,26,34.978V32.216A5.307,5.307,0,0,1,21.784,28ZM28,32.216v2.761A8.119,8.119,0,0,0,34.978,28H32.216A5.307,5.307,0,0,1,28,32.216ZM24.778,27A2.222,2.222,0,1,1,27,29.222,2.222,2.222,0,0,1,24.778,27Z"></path>`;

const FileCampaign = createWorkflowIcon('VueWorkflowFileCampaign', svgAttributes, svgInnerHTML);

export default FileCampaign;
