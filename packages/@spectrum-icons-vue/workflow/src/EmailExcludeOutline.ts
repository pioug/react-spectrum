import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.875,2H1.125A1.147,1.147,0,0,0,0,3.167V28.833A1.147,1.147,0,0,0,1.125,30H15.909a11.411,11.411,0,0,1-.359-2H2V25.608L13.165,17.25,16.8,19.975a1.967,1.967,0,0,0,.852.344A11.485,11.485,0,0,1,24.874,15.7L34,8.835V17.89a11.561,11.561,0,0,1,2,1.963V3.167A1.147,1.147,0,0,0,34.875,2ZM2,23.107V8.881L11.5,16Zm16-4.732L2,6.38V4H34V6.334Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM27,34a6.966,6.966,0,0,1-5.525-11.252l9.777,9.777A6.935,6.935,0,0,1,27,34Zm5.525-2.748-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const EmailExcludeOutline = createWorkflowIcon('VueWorkflowEmailExcludeOutline', svgAttributes, svgInnerHTML);

export default EmailExcludeOutline;
