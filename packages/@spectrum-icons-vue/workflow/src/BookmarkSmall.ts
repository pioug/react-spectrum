import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M17.022,23.848l6.122,5.988a.5.5,0,0,0,.542.106A.5.5,0,0,0,24,29.488V7a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V29.506a.523.523,0,0,0,.306.456.481.481,0,0,0,.542-.1Z"></path><path fill-rule="evenodd" d="M17.022,23.848l6.122,5.988a.5.5,0,0,0,.542.106A.5.5,0,0,0,24,29.488V7a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V29.506a.523.523,0,0,0,.306.456.481.481,0,0,0,.542-.1Z"></path>`;

const BookmarkSmall = createWorkflowIcon('VueWorkflowBookmarkSmall', svgAttributes, svgInnerHTML);

export default BookmarkSmall;
