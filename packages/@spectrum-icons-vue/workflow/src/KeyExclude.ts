import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path><path fill-rule="evenodd" d="M16.967,19.9c.52-.52,6.71-6.761,6.71-6.761l1.681,1.682a11.712,11.712,0,0,1,4.861.317l1.6-1.6L27.552,9.266l1.231-1.23,4.27,4.271,2.47-2.47a.75.75,0,0,0,0-1.061L29.06,2.313a1.5,1.5,0,0,0-2.122,0L13.177,16.073A8.888,8.888,0,0,0,9,15a9,9,0,1,0,6.21,15.491C13.969,26.29,15.188,21.681,16.967,19.9ZM7.5,28.5a3,3,0,1,1,3-3A3,3,0,0,1,7.5,28.5Z"></path>`;

const KeyExclude = createWorkflowIcon('VueWorkflowKeyExclude', svgAttributes, svgInnerHTML);

export default KeyExclude;
