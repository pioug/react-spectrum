import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.5,14H.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5h33a.5.5,0,0,0,.5-.5v-13A.5.5,0,0,0,33.5,14ZM22.214,16l.018.968C22.232,19.05,18.9,20.1,17,20.1s-5.25-1.05-5.25-3.107V16ZM6,26H2V16H6Zm20,0H8V16h2v1c0,3,3.134,5,7,5s7-2,7-5V16h2Zm6,0H28V16h4Z"></path><circle fill-rule="evenodd" cx="7" cy="11" r="1.3"></circle><circle fill-rule="evenodd" cx="27" cy="11" r="1.3"></circle><circle fill-rule="evenodd" cx="17" cy="5" r="1.3"></circle><circle fill-rule="evenodd" cx="11" cy="7" r="1.3"></circle><circle fill-rule="evenodd" cx="23" cy="7" r="1.3"></circle>`;

const StraightenOutline = createWorkflowIcon('VueWorkflowStraightenOutline', svgAttributes, svgInnerHTML);

export default StraightenOutline;
