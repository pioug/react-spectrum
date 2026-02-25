import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,20.188,36,6.665v-1.5A1.147,1.147,0,0,0,34.875,4H1.125A1.147,1.147,0,0,0,0,5.167V6.636Z"></path><polygon fill-rule="evenodd" points="24.779 17.963 36 26.367 36 13.334 36 9.541 24.779 17.963"></polygon><path fill-rule="evenodd" d="M22.866,19.4,19.29,22.094a2.172,2.172,0,0,1-2.58,0l-3.628-2.719L0,29.068v1.766A1.146,1.146,0,0,0,1.125,32h33.75A1.146,1.146,0,0,0,36,30.834v-1.59Z"></path><polygon fill-rule="evenodd" points="11.165 17.938 0 9.512 0 13.334 0 26.195 11.165 17.938"></polygon>`;

const Email = createWorkflowIcon('VueWorkflowEmail', svgAttributes, svgInnerHTML);

export default Email;
