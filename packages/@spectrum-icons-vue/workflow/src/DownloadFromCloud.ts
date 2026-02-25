import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,11.3a6.461,6.461,0,0,0-2.151-.118,8.345,8.345,0,0,0,0-4.407,8.024,8.024,0,0,0-5.71-5.648A8.162,8.162,0,0,0,12.924,7.948a6.97,6.97,0,0,0-3.361-.055,6.849,6.849,0,0,0-5.124,5.212,6.972,6.972,0,0,0,.078,3.237A3.862,3.862,0,0,0,.053,20.791,4,4,0,0,0,4.064,24H16V15a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1v9h9.572A6.429,6.429,0,0,0,31,11.3Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M16,28H11.7a.7.7,0,0,0-.7.7.685.685,0,0,0,.207.49l6.468,6.145a.5.5,0,0,0,.65,0L24.794,29.2a.688.688,0,0,0,.206-.49.7.7,0,0,0-.7-.7H20V24H16Z" transform="translate(0)"></path>`;

const DownloadFromCloud = createWorkflowIcon('VueWorkflowDownloadFromCloud', svgAttributes, svgInnerHTML);

export default DownloadFromCloud;
