import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16.2,30H2V10H30v6.2l2,2V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H18.2Z"></path><path fill-rule="evenodd" d="M35.668,26.106l-9.88-9.879A.772.772,0,0,0,25.242,16h-8.47a.772.772,0,0,0-.772.772v8.471a.772.772,0,0,0,.226.546l9.879,9.88a.772.772,0,0,0,1.092,0L35.668,27.2A.772.772,0,0,0,35.668,26.106ZM20.4,22.948A2.548,2.548,0,1,1,22.948,20.4,2.548,2.548,0,0,1,20.4,22.948Z"></path>`;

const PageTag = createWorkflowIcon('VueWorkflowPageTag', svgAttributes, svgInnerHTML);

export default PageTag;
