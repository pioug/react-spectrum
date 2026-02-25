import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<ellipse fill-rule="evenodd" cx="18" cy="7" rx="16" ry="5"></ellipse><path fill-rule="evenodd" d="M10.6,29.766a10.425,10.425,0,0,1,1.819-5.55l.209-.281C8.117,23.408,3.245,22.244,2,20.27V29c0,2.029,3.874,3.771,9.429,4.555A9.315,9.315,0,0,1,10.6,29.766Z"></path><path fill-rule="evenodd" d="M34,12.8V10.27a9.226,9.226,0,0,1-4.529,2.53Z"></path><path fill-rule="evenodd" d="M19.729,14.39c.044-.058.1-.1.149-.156-.665.027-1.3.041-1.877.041-4.936,0-14.212-1.168-16-4V17c0,2.349,5.191,4.314,12.179,4.851Z"></path><path fill-rule="evenodd" d="M27.656,32.883H19.721a2.922,2.922,0,0,1-3.113-3.117,2.927,2.927,0,0,1,3.113-3.116H28.23a.779.779,0,0,0,.623-.312l6.831-9.714A.39.39,0,0,0,35.373,16H22.911a.779.779,0,0,0-.623.312l-7.3,9.814A6.219,6.219,0,0,0,20.01,36l8.22,0a.779.779,0,0,0,.623-.312l6.831-9.714a.39.39,0,0,0-.312-.623H32.851Z"></path>`;

const DataBook = createWorkflowIcon('VueWorkflowDataBook', svgAttributes, svgInnerHTML);

export default DataBook;
