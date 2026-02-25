import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9,14H6.993V3a.988.988,0,0,0-.987-1H5.014a1,1,0,0,0-1,1L4.007,14H2a.5.5,0,0,0-.5.5.49.49,0,0,0,.147.35l3.537,4.033a.5.5,0,0,0,.632,0l3.537-4.033A.49.49,0,0,0,9.5,14.5.5.5,0,0,0,9,14Z"></path><path fill-rule="evenodd" d="M23,3.829,31.682,9,23,14.17,14.318,9ZM23,1a1.2,1.2,0,0,0-.629.178L10.381,8.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006L35.613,9.685a.8.8,0,0,0,.007-1.366L23.629,1.178A1.194,1.194,0,0,0,23,1Z"></path><path fill-rule="evenodd" d="M35.62,17.319,31.726,15,23,20l-8.726-5-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path><path fill-rule="evenodd" d="M31.726,24l-2.54,1.513L31.682,27,23,32.17,14.318,27l2.5-1.487L14.274,24l-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path>`;

const LayersBackward = createWorkflowIcon('VueWorkflowLayersBackward', svgAttributes, svgInnerHTML);

export default LayersBackward;
