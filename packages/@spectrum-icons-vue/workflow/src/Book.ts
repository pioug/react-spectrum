import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M19.782,28H9.995a4,4,0,0,1,0-8H20.518a1,1,0,0,0,.8-.4l11.1-14.8a.5.5,0,0,0-.4-.8H16.025a1,1,0,0,0-.8.4L3.522,19.328A7.981,7.981,0,0,0,9.969,32l10.549,0a1,1,0,0,0,.8-.4l11.1-14.8a.5.5,0,0,0-.4-.8H28.782Z"></path>`;

const Book = createWorkflowIcon('VueWorkflowBook', svgAttributes, svgInnerHTML);

export default Book;
