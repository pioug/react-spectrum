import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8,9V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V14.914a1,1,0,0,0-.293-.707L27.793,8.293A1,1,0,0,0,27.086,8H9A1,1,0,0,0,8,9ZM32,32H10V10H26v5a1,1,0,0,0,1,1h5Z"></path><rect fill-rule="evenodd" height="6" width="2" x="8"></rect><rect fill-rule="evenodd" height="2" width="6" y="8"></rect>`;

const Artboard = createWorkflowIcon('VueWorkflowArtboard', svgAttributes, svgInnerHTML);

export default Artboard;
