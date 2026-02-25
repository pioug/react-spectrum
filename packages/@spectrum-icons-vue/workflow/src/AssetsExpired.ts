import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.895,34.782,24.715,14.775a.819.819,0,0,0-1.429,0L12.105,34.782A.819.819,0,0,0,12.82,36H35.18A.819.819,0,0,0,35.895,34.782ZM25.368,32.808a.456.456,0,0,1-.456.456H23.088a.456.456,0,0,1-.456-.456V30.983a.456.456,0,0,1,.456-.456h1.824a.456.456,0,0,1,.456.456Zm0-4.56a.456.456,0,0,1-.456.456H23.088a.456.456,0,0,1-.456-.456V20.038a.456.456,0,0,1,.456-.456h1.824a.456.456,0,0,1,.456.456Z"></path><path fill-rule="evenodd" d="M12.968,26h1.754l1.117-2H4V4H32V23.712l1.25,2.237A.986.986,0,0,0,34,25V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1h9.968Z"></path>`;

const AssetsExpired = createWorkflowIcon('VueWorkflowAssetsExpired', svgAttributes, svgInnerHTML);

export default AssetsExpired;
