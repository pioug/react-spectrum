import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M1.994,22H4V33a.988.988,0,0,0,.986,1h.993a1,1,0,0,0,1-1l.006-11H8.992a.5.5,0,0,0,.5-.5.491.491,0,0,0-.148-.35L5.809,17.113a.5.5,0,0,0-.633,0L1.64,21.146a.49.49,0,0,0-.147.35A.5.5,0,0,0,1.994,22Z"></path><path fill-rule="evenodd" d="M23,3.829,31.682,9,23,14.17,14.318,9ZM23,1a1.2,1.2,0,0,0-.629.178L10.381,8.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006L35.613,9.685a.8.8,0,0,0,.007-1.366L23.629,1.178A1.194,1.194,0,0,0,23,1Z"></path><path fill-rule="evenodd" d="M35.62,17.319,31.726,15,23,20l-8.726-5-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path><path fill-rule="evenodd" d="M31.726,24l-2.54,1.513L31.682,27,23,32.17,14.318,27l2.5-1.487L14.274,24l-3.893,2.319a.8.8,0,0,0,0,1.362l11.99,7.141a1.2,1.2,0,0,0,1.249.006l11.993-7.143a.8.8,0,0,0,.007-1.366Z"></path>`;

const LayersForward = createWorkflowIcon('VueWorkflowLayersForward', svgAttributes, svgInnerHTML);

export default LayersForward;
