import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,8H4.007V33a.988.988,0,0,0,.987,1h.992a1,1,0,0,0,1-1L6.993,8H9a.5.5,0,0,0,.5-.5.49.49,0,0,0-.147-.35L5.816,3.113a.5.5,0,0,0-.632,0L1.647,7.146A.49.49,0,0,0,1.5,7.5.5.5,0,0,0,2,8Z"></path><path fill-rule="evenodd" d="M23,1a1.2,1.2,0,0,0-.629.178L10.381,8.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006L35.613,9.685a.8.8,0,0,0,.007-1.366L23.629,1.178A1.194,1.194,0,0,0,23,1Z"></path><path fill-rule="evenodd" d="M31.726,24l-2.54,1.513L31.682,27,23,32.17,14.318,27l2.5-1.487L14.274,24l-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path><path fill-rule="evenodd" d="M31.726,15l-2.54,1.513L31.682,18,23,23.17,14.318,18l2.5-1.487L14.274,15l-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path>`;

const LayersBringToFront = createWorkflowIcon('VueWorkflowLayersBringToFront', svgAttributes, svgInnerHTML);

export default LayersBringToFront;
