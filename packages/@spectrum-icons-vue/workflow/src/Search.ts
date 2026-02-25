import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.173,30.215,25.4,22.443A12.826,12.826,0,1,0,22.443,25.4l7.772,7.772a2.1,2.1,0,0,0,2.958-2.958ZM6,15a9,9,0,1,1,9,9A9,9,0,0,1,6,15Z"></path>`;

const Search = createWorkflowIcon('VueWorkflowSearch', svgAttributes, svgInnerHTML);

export default Search;
