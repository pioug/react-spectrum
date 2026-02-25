import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.1,25A8.9,8.9,0,1,0,27,16.1,8.9,8.9,0,0,0,18.1,25Zm3.9-.5a.5.5,0,0,1,.5-.5H26V20.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V24h3.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V26H22.5a.5.5,0,0,1-.5-.5Z"></path><path fill-rule="evenodd" d="M15.084,28H14V18h2.893a12.368,12.368,0,0,1,1.743-2H14V6h8v7.769a12.2,12.2,0,0,1,2-.685V6h8v7.769a12.274,12.274,0,0,1,2,1.124V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H15.769A12.2,12.2,0,0,1,15.084,28ZM12,28H4V18h8Zm0-12H4V6h8Z"></path>`;

const CollectionAdd = createWorkflowIcon('VueWorkflowCollectionAdd', svgAttributes, svgInnerHTML);

export default CollectionAdd;
