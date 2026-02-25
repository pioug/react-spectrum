import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.084,28H14V18h2.893a12.368,12.368,0,0,1,1.743-2H14V6h8v7.769a12.2,12.2,0,0,1,2-.685V6h8v7.769a12.274,12.274,0,0,1,2,1.124V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H15.769A12.2,12.2,0,0,1,15.084,28ZM12,28H4V18h8Zm0-12H4V6h8Z"></path><path fill-rule="evenodd" d="M27,16.1A8.9,8.9,0,1,0,35.9,25,8.9,8.9,0,0,0,27,16.1ZM20,25a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,25Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const CollectionExclude = createWorkflowIcon('VueWorkflowCollectionExclude', svgAttributes, svgInnerHTML);

export default CollectionExclude;
