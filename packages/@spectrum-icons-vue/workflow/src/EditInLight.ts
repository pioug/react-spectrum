import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.645,16.685l-4.324-4.323a.912.912,0,0,0-.65-.265h-.028a1.035,1.035,0,0,0-.7.3L14.711,27.639a.736.736,0,0,0-.188.315l-2.444,7.34c-.085.282.345.638.588.638a.231.231,0,0,0,.046-.005c.207-.048,6.26-2.118,7.344-2.444a.733.733,0,0,0,.31-.187L35.6,18.059a1.03,1.03,0,0,0,.3-.662A.916.916,0,0,0,35.645,16.685ZM14.039,33.973l1.978-5.519,3.54,3.531C17.936,32.472,15.439,33.555,14.039,33.973Z"></path><path fill-rule="evenodd" d="M27,2H3A1,1,0,0,0,2,3V27a1,1,0,0,0,1,1h9.077l.225-.678a2.7,2.7,0,0,1,.672-1.1L13.2,26H4V4H26v9.166l2-2V3A1,1,0,0,0,27,2Z"></path>`;

const EditInLight = createWorkflowIcon('VueWorkflowEditInLight', svgAttributes, svgInnerHTML);

export default EditInLight;
