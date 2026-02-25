import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,28H14V18h6V16H14V6h8v8h2V6h8v8h2V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H20Zm-8,0H4V18h8Zm0-12H4V6h8Z"></path><path fill-rule="evenodd" d="M35.394,25.051l-3.837-3.837,4.3-4.363A.5.5,0,0,0,35.5,16H22V29.494a.5.5,0,0,0,.854.358l4.33-4.265,3.837,3.837a1,1,0,0,0,1.414,0l2.96-2.959A1,1,0,0,0,35.394,25.051Z"></path>`;

const CollectionAddTo = createWorkflowIcon('VueWorkflowCollectionAddTo', svgAttributes, svgInnerHTML);

export default CollectionAddTo;
