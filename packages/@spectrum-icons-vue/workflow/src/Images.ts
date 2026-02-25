import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,5a1.068,1.068,0,0,0-1.125-1H1.125A1.068,1.068,0,0,0,0,5V27a1.068,1.068,0,0,0,1.125,1H2V6H32Z"></path><path fill-rule="evenodd" d="M35,8H5A1,1,0,0,0,4,9V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V9A1,1,0,0,0,35,8ZM34,27.373,28.728,22.1a2,2,0,0,0-2.828,0l-3.072,3.072-7.556-7.557a2,2,0,0,0-2.828,0L6,24.059V10H34Z"></path><circle fill-rule="evenodd" cx="29" cy="15" r="2.5"></circle>`;

const Images = createWorkflowIcon('VueWorkflowImages', svgAttributes, svgInnerHTML);

export default Images;
