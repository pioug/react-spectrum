import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10.874,19.622a.5.5,0,0,0-.874.332V24H3a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h7v3.818a.5.5,0,0,0,.874.332L18,27Z"></path><path fill-rule="evenodd" d="M26.255,19.775a1.438,1.438,0,0,1-1.244-1.443V16.249a1.441,1.441,0,0,1,.367-.93,11,11,0,0,0,2.5-6.866c0-5.2-2.756-8.1-6.919-8.1s-7,3.018-7,8.1a11.124,11.124,0,0,0,2.645,6.893,1.388,1.388,0,0,1,.344.9v2.126a1.4,1.4,0,0,1-1.368,1.394L22.569,27l-2.99,3H35.936c.006-.731.011-1.417.011-1.526C35.947,26.311,34.469,20.609,26.255,19.775Z"></path>`;

const UserArrow = createWorkflowIcon('VueWorkflowUserArrow', svgAttributes, svgInnerHTML);

export default UserArrow;
