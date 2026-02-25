import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M17.575,17.83,2.887,10.351c-.241-.123-.241-.323,0-.446l14.688-7.48a.943.943,0,0,1,.85,0L33.113,9.9c.241.123.241.323,0,.446L18.425,17.83A.936.936,0,0,1,17.575,17.83Z"></path><path fill-rule="evenodd" d="M33.114,25.905l-4.6-2.341L18,28.918,7.484,23.564l-4.6,2.341c-.241.123-.241.323,0,.446L17.575,33.83a.936.936,0,0,0,.85,0l14.689-7.479C33.354,26.228,33.354,26.028,33.114,25.905Z"></path><path fill-rule="evenodd" d="M33.114,17.905l-4.6-2.341L18,20.918,7.484,15.564l-4.6,2.341c-.241.123-.241.323,0,.446L17.575,25.83a.936.936,0,0,0,.85,0l14.689-7.479C33.354,18.228,33.354,18.028,33.114,17.905Z"></path>`;

const ShowAllLayers = createWorkflowIcon('VueWorkflowShowAllLayers', svgAttributes, svgInnerHTML);

export default ShowAllLayers;
