import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24.613,8.58A14.972,14.972,0,0,0,18,6.937c-8.664,0-15.75,8.625-15.75,11.423,0,3,7.458,10.7,15.686,10.7,8.3,0,15.814-7.706,15.814-10.7C33.75,16,29.536,11.019,24.613,8.58ZM18,27.225A9.225,9.225,0,1,1,27.225,18,9.225,9.225,0,0,1,18,27.225Z"></path><path fill-rule="evenodd" d="M20.667,18.083A2.667,2.667,0,0,1,18,15.417a2.632,2.632,0,0,1,1.35-2.27A4.939,4.939,0,0,0,18,12.938,5.063,5.063,0,1,0,23.063,18a4.713,4.713,0,0,0-.175-1.2A2.625,2.625,0,0,1,20.667,18.083Z"></path>`;

const Visibility = createWorkflowIcon('VueWorkflowVisibility', svgAttributes, svgInnerHTML);

export default Visibility;
