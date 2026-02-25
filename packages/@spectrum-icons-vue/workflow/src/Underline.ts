import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="22" x="7" y="30"></rect><path fill-rule="evenodd" d="M22.5,4.012a.5.5,0,0,0-.5.5v13.5s.482,6.2-5,6.2c-5.459,0-5-6.2-5-6.2V4.512a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v13.5c0,1.412-.141,10,9,10S26,19,26,17.988V4.512a.5.5,0,0,0-.5-.5Z"></path>`;

const Underline = createWorkflowIcon('VueWorkflowUnderline', svgAttributes, svgInnerHTML);

export default Underline;
