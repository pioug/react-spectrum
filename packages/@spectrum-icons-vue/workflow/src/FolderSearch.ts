import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,6H2V3.5A1.5,1.5,0,0,1,3.5,2h7.672a2,2,0,0,1,1.414.586Z"></path><path fill-rule="evenodd" d="M11.223,22.734A11.58,11.58,0,0,1,34,19.779V9a1,1,0,0,0-1-1H2V29a1,1,0,0,0,1,1H13.793A11.526,11.526,0,0,1,11.223,22.734Z"></path><path fill-rule="evenodd" d="M35.385,32.269l-4.917-4.917A9.065,9.065,0,1,0,27.419,30.4l4.917,4.917a2.044,2.044,0,0,0,3.048,0A2.2,2.2,0,0,0,35.385,32.269Zm-18.15-9.534A5.568,5.568,0,1,1,22.8,28.3,5.568,5.568,0,0,1,17.234,22.735Z"></path>`;

const FolderSearch = createWorkflowIcon('VueWorkflowFolderSearch', svgAttributes, svgInnerHTML);

export default FolderSearch;
