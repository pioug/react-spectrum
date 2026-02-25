import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M11,30H9a.979.979,0,0,0-1,1v1H18V22H4V4H28V6h4V1a1,1,0,0,0-1-1H1A1,1,0,0,0,0,1V25a1,1,0,0,0,1,1H12v3A1,1,0,0,1,11,30Z"></path><path fill-rule="evenodd" d="M34,8H22a2,2,0,0,0-2,2V34a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V10A2,2,0,0,0,34,8Zm-7,2h2a1,1,0,0,1,0,2H27a1,1,0,0,1,0-2Zm1,25.1A2.1,2.1,0,1,1,30.1,33,2.1,2.1,0,0,1,28,35.1ZM34,30H22V14H34Z"></path>`;

const DesktopAndMobile = createWorkflowIcon('VueWorkflowDesktopAndMobile', svgAttributes, svgInnerHTML);

export default DesktopAndMobile;
