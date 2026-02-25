import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.062,26.394l9.375,9.376c.311.316.561.2.561-.252V3a1,1,0,0,0-1-1H9.012a1,1,0,0,0-1,1L8,35.551c0,.457.262.578.586.281Z"></path>`;

const BookmarkSingle = createWorkflowIcon('VueWorkflowBookmarkSingle', svgAttributes, svgInnerHTML);

export default BookmarkSingle;
