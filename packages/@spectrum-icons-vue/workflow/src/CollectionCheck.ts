import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.084,28H14V18h2.893a12.368,12.368,0,0,1,1.743-2H14V6h8v7.769a12.2,12.2,0,0,1,2-.685V6h8v7.769a12.274,12.274,0,0,1,2,1.124V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H15.769A12.2,12.2,0,0,1,15.084,28ZM12,28H4V18h8Zm0-12H4V6h8Z"></path><path fill-rule="evenodd" d="M27,16.1A8.9,8.9,0,1,0,35.9,25,8.9,8.9,0,0,0,27,16.1ZM24.662,30.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,30.412Z"></path>`;

const CollectionCheck = createWorkflowIcon('VueWorkflowCollectionCheck', svgAttributes, svgInnerHTML);

export default CollectionCheck;
