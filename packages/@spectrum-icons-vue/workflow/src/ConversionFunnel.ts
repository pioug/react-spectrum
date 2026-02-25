import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10,24V35a1,1,0,0,0,1,1H23a1,1,0,0,0,1-1V24Zm11.975,4.2-5.053,6.738a.375.375,0,0,1-.565.04L12.7,31.326a.375.375,0,0,1,0-.53L14.3,29.2a.375.375,0,0,1,.53,0l1.512,1.512L19.575,26.4a.375.375,0,0,1,.525-.075l1.8,1.35A.375.375,0,0,1,21.975,28.2Z"></path><polygon fill-rule="evenodd" points="29 12 5 12 9.167 22 24.833 22 29 12"></polygon><path fill-rule="evenodd" d="M33.25,0H.75A.5.5,0,0,0,.288.692L4.167,10H29.833L33.712.692A.5.5,0,0,0,33.25,0Z"></path>`;

const ConversionFunnel = createWorkflowIcon('VueWorkflowConversionFunnel', svgAttributes, svgInnerHTML);

export default ConversionFunnel;
