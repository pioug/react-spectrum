import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,18H17a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V22h4V32H23a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V33a1,1,0,0,0-1-1H28V22h4v1a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V19A1,1,0,0,0,35,18Z"></path><path fill-rule="evenodd" d="M31,2H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H14V18a2,2,0,0,1,2-2h2.687l-5.415-5.414a2,2,0,0,0-2.828,0L4,17.029V4H30V16h2V3A1,1,0,0,0,31,2Z"></path><circle fill-rule="evenodd" cx="24.7" cy="9.3" r="2.7"></circle>`;

const ImageText = createWorkflowIcon('VueWorkflowImageText', svgAttributes, svgInnerHTML);

export default ImageText;
