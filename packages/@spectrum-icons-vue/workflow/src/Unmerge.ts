import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.2,20.206a.688.688,0,0,0-.49-.206.7.7,0,0,0-.7.7V24H20V10h6v3.3a.7.7,0,0,0,.7.7.688.688,0,0,0,.49-.206L32.88,7.325a.5.5,0,0,0,0-.65L27.2.206A.688.688,0,0,0,26.705,0a.7.7,0,0,0-.7.7V4H15a1,1,0,0,0-1,1v9H3a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H14v9a1,1,0,0,0,1,1H26v3.3a.7.7,0,0,0,.7.7.688.688,0,0,0,.49-.206l5.685-6.469a.5.5,0,0,0,0-.65Z"></path>`;

const Unmerge = createWorkflowIcon('VueWorkflowUnmerge', svgAttributes, svgInnerHTML);

export default Unmerge;
