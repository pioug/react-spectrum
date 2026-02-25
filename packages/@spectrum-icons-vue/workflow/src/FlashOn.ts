import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="12 2 26 2 18 14 28 14 8.9 36 8 36 14 20 6.25 20 12 2"></polygon>`;

const FlashOn = createWorkflowIcon('VueWorkflowFlashOn', svgAttributes, svgInnerHTML);

export default FlashOn;
