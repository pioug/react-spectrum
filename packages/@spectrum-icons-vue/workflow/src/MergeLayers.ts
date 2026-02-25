import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32.62,23.319,24.479,18l8.134-5.315a.8.8,0,0,0,.007-1.366L18.629,2.178a1.2,1.2,0,0,0-1.258,0L3.381,11.319a.8.8,0,0,0,0,1.362L11.521,18l-8.14,5.319a.8.8,0,0,0,0,1.362l13.99,9.141a1.2,1.2,0,0,0,1.249.006l13.993-9.143a.8.8,0,0,0,.007-1.366Zm-8.856,2.047L18.313,30.89a.5.5,0,0,1-.626,0l-5.451-5.524a.785.785,0,0,1-.236-.56A.8.8,0,0,1,12.8,24h3.7V18.164L7.318,12,18,4.829,28.682,12,19.5,18.164V24h3.7a.8.8,0,0,1,.8.806A.785.785,0,0,1,23.764,25.366Z"></path>`;

const MergeLayers = createWorkflowIcon('VueWorkflowMergeLayers', svgAttributes, svgInnerHTML);

export default MergeLayers;
