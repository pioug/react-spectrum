import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M7.919,4A1.561,1.561,0,0,0,6.568,5L4.459,11a.685.685,0,0,0,.649,1h2a1.557,1.557,0,0,0,1.351-1L9.514,8h8L10.486,28h-3a1.557,1.557,0,0,0-1.351,1l-.7,2a.685.685,0,0,0,.649,1h10a1.557,1.557,0,0,0,1.351-1l.7-2a.684.684,0,0,0-.649-1h-3L21.514,8h8l-1.055,3a.685.685,0,0,0,.649,1h2a1.557,1.557,0,0,0,1.351-1l2.109-6a.686.686,0,0,0-.649-1Z"></path>`;

const TextItalic = createWorkflowIcon('VueWorkflowTextItalic', svgAttributes, svgInnerHTML);

export default TextItalic;
