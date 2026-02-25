import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.014,25.941,14.955,24H4V4H32V9.982a3.189,3.189,0,0,1,1.023.688l.977.977V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1h9.968C12.985,25.982,13,25.959,13.014,25.941Z"></path><path fill-rule="evenodd" d="M35.645,16.685l-4.323-4.323a.911.911,0,0,0-.65-.265h-.029a1.028,1.028,0,0,0-.7.3L14.711,27.639a.748.748,0,0,0-.188.316l-2.443,7.34c-.085.282.344.638.587.638a.206.206,0,0,0,.046,0c.207-.048,6.26-2.118,7.344-2.444a.735.735,0,0,0,.311-.187L35.6,18.059a1.031,1.031,0,0,0,.3-.662A.916.916,0,0,0,35.645,16.685ZM14.039,33.973l1.978-5.519,3.54,3.531C17.936,32.472,15.439,33.555,14.039,33.973Z"></path>`;

const AssetsModified = createWorkflowIcon('VueWorkflowAssetsModified', svgAttributes, svgInnerHTML);

export default AssetsModified;
