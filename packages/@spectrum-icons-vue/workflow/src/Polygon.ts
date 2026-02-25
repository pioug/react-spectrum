import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.61,17.53,26.942,4.565A1.077,1.077,0,0,0,26,4H10.046a1.077,1.077,0,0,0-.946.561l-7.708,12.9a1.079,1.079,0,0,0,0,1.03L9.1,31.438a1.079,1.079,0,0,0,.946.562H26a1.078,1.078,0,0,0,.947-.563l7.666-12.881A1.079,1.079,0,0,0,34.61,17.53ZM25.447,30H10.6L3.388,17.98,10.593,6H25.444l7.169,12.04Z"></path>`;

const Polygon = createWorkflowIcon('VueWorkflowPolygon', svgAttributes, svgInnerHTML);

export default Polygon;
