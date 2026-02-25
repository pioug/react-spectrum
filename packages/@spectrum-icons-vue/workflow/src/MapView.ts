import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25.6,2.106,18,5.905,10.447,2.128a1,1,0,0,0-.894,0l-7,3.5A1,1,0,0,0,2,6.523V32.287a1,1,0,0,0,1.447.894L10,29.905l7.553,3.776a1,1,0,0,0,.894,0L26,29.905l8.629,3.451A1,1,0,0,0,36,32.428V6.582a1,1,0,0,0-.629-.929L26.417,2.072A1,1,0,0,0,25.6,2.106ZM18,31.741l-8-4V4l8,4Zm16-.711-8-3.125v-24L34,7.03Z"></path>`;

const MapView = createWorkflowIcon('VueWorkflowMapView', svgAttributes, svgInnerHTML);

export default MapView;
