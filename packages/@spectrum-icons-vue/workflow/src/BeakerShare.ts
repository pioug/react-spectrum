import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,35V23a2.976,2.976,0,0,1,.031-.3l-5.3,1.667L12,14.453V4h8v9.45l2-2.218V4h1a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H9A1,1,0,0,0,8,1V3A1,1,0,0,0,9,4h1V14L.928,31.759A3,3,0,0,0,3.659,36h8.525A2.972,2.972,0,0,1,12,35Z"></path><path fill-rule="evenodd" d="M29.722,18.331,24,12l-5.708,6.331A1,1,0,0,0,19.035,20H22v7.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V20h2.979A1,1,0,0,0,29.722,18.331Z"></path><path fill-rule="evenodd" d="M30,22V32H18V22H15a1,1,0,0,0-1,1V35a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1Z"></path>`;

const BeakerShare = createWorkflowIcon('VueWorkflowBeakerShare', svgAttributes, svgInnerHTML);

export default BeakerShare;
