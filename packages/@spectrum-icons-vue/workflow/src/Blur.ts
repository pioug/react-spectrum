import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.909.347C16.261,9.619,7.182,16.871,7.182,24.3c0,5.548,4.843,10.046,10.818,10.046s10.818-4.5,10.818-10.046C28.818,16.633,17.324,8.557,14.909.347Z"></path>`;

const Blur = createWorkflowIcon('VueWorkflowBlur', svgAttributes, svgInnerHTML);

export default Blur;
