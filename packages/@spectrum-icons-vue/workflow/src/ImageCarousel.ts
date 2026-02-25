import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="22" rx="1" ry="1" width="24" x="6" y="2"></rect><path fill-rule="evenodd" d="M4,22H1a1,1,0,0,1-1-1V7A1,1,0,0,1,1,6H4Z"></path><path fill-rule="evenodd" d="M35,22H32V6h3a1,1,0,0,1,1,1V21A1,1,0,0,1,35,22Z"></path><circle fill-rule="evenodd" cx="8" cy="30" r="1.4"></circle><circle fill-rule="evenodd" cx="14" cy="30" r="2.1"></circle><circle fill-rule="evenodd" cx="20" cy="30" r="1.4"></circle><circle fill-rule="evenodd" cx="26" cy="30" r="1.4"></circle>`;

const ImageCarousel = createWorkflowIcon('VueWorkflowImageCarousel', svgAttributes, svgInnerHTML);

export default ImageCarousel;
