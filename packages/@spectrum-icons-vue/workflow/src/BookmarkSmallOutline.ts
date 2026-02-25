import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,8V25.914l-3.58-3.5-1.4-1.364-1.4,1.36L12,25.944V8H22m1-2H11a1,1,0,0,0-1,1V29.506a.523.523,0,0,0,.306.456.421.421,0,0,0,.2.044.511.511,0,0,0,.352-.148l6.174-6.01,6.122,5.988a.5.5,0,0,0,.352.144.472.472,0,0,0,.2-.038A.5.5,0,0,0,24,29.488V7A1,1,0,0,0,23,6Z"></path>`;

const BookmarkSmallOutline = createWorkflowIcon('VueWorkflowBookmarkSmallOutline', svgAttributes, svgInnerHTML);

export default BookmarkSmallOutline;
