import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="7.939" cy="6.25" r="3.75"></circle><polygon fill-rule="evenodd" points="21.506 10 12.756 10 17.131 2.5 21.506 10"></polygon><circle fill-rule="evenodd" cx="11.939" cy="30.25" r="3.75"></circle><polygon fill-rule="evenodd" points="27.603 34 18.853 34 23.228 26.5 27.603 34"></polygon><polygon fill-rule="evenodd" points="32.121 10 23.371 10 27.746 2.5 32.121 10"></polygon><path fill-rule="evenodd" d="M27.939,12.058h-20V13.28a1.514,1.514,0,0,0,.723,1.3L14.351,18.6a3.056,3.056,0,0,1,1.114,2.377V25.17a.733.733,0,0,0,.714.75H19.7a.733.733,0,0,0,.714-.75V20.976A3.056,3.056,0,0,1,21.527,18.6l5.689-4.015a1.514,1.514,0,0,0,.723-1.3Z"></path>`;

const Deduplication = createWorkflowIcon('VueWorkflowDeduplication', svgAttributes, svgInnerHTML);

export default Deduplication;
