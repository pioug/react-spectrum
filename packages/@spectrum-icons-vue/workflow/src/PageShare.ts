import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.722,18.331,24,12l-5.708,6.331A1,1,0,0,0,19.035,20H22v7.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V20h2.979A1,1,0,0,0,29.722,18.331Z"></path><path fill-rule="evenodd" d="M30,22V32H18V22H15a1,1,0,0,0-1,1V35a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1Z"></path><path fill-rule="evenodd" d="M12,30H4V10H32V20h2V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V31a1,1,0,0,0,1,1h9Z"></path>`;

const PageShare = createWorkflowIcon('VueWorkflowPageShare', svgAttributes, svgInnerHTML);

export default PageShare;
