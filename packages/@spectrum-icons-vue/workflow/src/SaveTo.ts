import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,10H27a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h3V30H6V14H9a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10Z"></path><path fill-rule="evenodd" d="M10.2,17.331l7.445,7.525a.5.5,0,0,0,.7,0L25.8,17.331a.782.782,0,0,0,.2-.526.8.8,0,0,0-.8-.8H20V3a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1V16H10.8a.8.8,0,0,0-.8.8A.782.782,0,0,0,10.2,17.331Z"></path>`;

const SaveTo = createWorkflowIcon('VueWorkflowSaveTo', svgAttributes, svgInnerHTML);

export default SaveTo;
