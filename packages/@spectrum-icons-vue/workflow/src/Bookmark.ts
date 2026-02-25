import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.071,34.724,13,31.373l-2.071,3.351A.5.5,0,0,1,10,34.467V24h6V34.467A.5.5,0,0,1,15.071,34.724Z"></path><path fill-rule="evenodd" d="M8,27.443A3.987,3.987,0,0,1,9.995,20H20.518a1,1,0,0,0,.8-.4l11.1-14.8a.5.5,0,0,0-.4-.8H16.025a1,1,0,0,0-.8.4L3.522,19.328H3.53A7.942,7.942,0,0,0,8,31.716Z"></path><path fill-rule="evenodd" d="M32.018,16H28.782l-9,12H18v4h2.518a1,1,0,0,0,.8-.4l11.1-14.8A.5.5,0,0,0,32.018,16Z"></path>`;

const Bookmark = createWorkflowIcon('VueWorkflowBookmark', svgAttributes, svgInnerHTML);

export default Bookmark;
