import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,27a10.962,10.962,0,0,1,.416-3H12V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V8H3A1,1,0,0,0,2,9v2a1,1,0,0,0,1,1H8V27a1,1,0,0,0,1,1h7.046C16.016,27.671,16,27.337,16,27Z"></path><path fill-rule="evenodd" d="M24,16.416A10.962,10.962,0,0,1,27,16c.337,0,.671.016,1,.046V9a1,1,0,0,0-1-1H14v4H24Z"></path><path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm4.081,9.748-5.927,6.778a.613.613,0,0,1-1.027-.642l2-4.749L23.3,27.921a1.059,1.059,0,0,1-.379-1.67l5.928-6.777a.613.613,0,0,1,1.026.642l-2,4.749L30.7,26.079A1.058,1.058,0,0,1,31.081,27.748Z"></path>`;

const CropLightning = createWorkflowIcon('VueWorkflowCropLightning', svgAttributes, svgInnerHTML);

export default CropLightning;
