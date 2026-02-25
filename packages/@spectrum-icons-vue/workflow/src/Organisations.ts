import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H15a1,1,0,0,0-1,1V14H24V34h9a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM22,10H16V6h6ZM32,26H26V22h6Zm0-8H26V14h6Zm0-8H26V6h6Z"></path><path fill-rule="evenodd" d="M2,17V33a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V17a1,1,0,0,0-1-1H3A1,1,0,0,0,2,17Zm12,1h6v4H14ZM4,18h6v4H4Zm0,8h6v4H4Z"></path>`;

const Organisations = createWorkflowIcon('VueWorkflowOrganisations', svgAttributes, svgInnerHTML);

export default Organisations;
