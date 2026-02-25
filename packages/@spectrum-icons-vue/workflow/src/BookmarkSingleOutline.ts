import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,4V31.5l-6.522-6.523-1.412-1.411L16.65,24.977,10,31.6,10.011,4Zm1-2H9.012a1,1,0,0,0-1,1L8,35.551c0,.288.1.443.263.443a.517.517,0,0,0,.323-.162l9.476-9.438,9.375,9.376a.488.488,0,0,0,.318.177c.147,0,.243-.152.243-.429V3A1,1,0,0,0,27,2Z"></path>`;

const BookmarkSingleOutline = createWorkflowIcon('VueWorkflowBookmarkSingleOutline', svgAttributes, svgInnerHTML);

export default BookmarkSingleOutline;
