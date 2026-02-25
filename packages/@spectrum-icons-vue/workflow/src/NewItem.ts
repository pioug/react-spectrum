import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,6H28V28H6ZM5.2002,4A1.18942,1.18942,0,0,0,4,5.2002V29a.99934.99934,0,0,0,1,1H28.7998A1.18942,1.18942,0,0,0,30,28.7998V5.2002A1.18893,1.18893,0,0,0,28.7998,4Z"></path><path fill-rule="evenodd" d="M16.5,10a.49967.49967,0,0,0-.5.5V16H10.5a.49967.49967,0,0,0-.5.5v1a.49967.49967,0,0,0,.5.5H16v5.5a.49967.49967,0,0,0,.5.5h1a.49967.49967,0,0,0,.5-.5V18h5.5a.49967.49967,0,0,0,.5-.5v-1a.49967.49967,0,0,0-.5-.5H18V10.5a.49967.49967,0,0,0-.5-.5Z"></path>`;

const NewItem = createWorkflowIcon('VueWorkflowNewItem', svgAttributes, svgInnerHTML);

export default NewItem;
