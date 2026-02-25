import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,26V23a1,1,0,0,0-1-1H29a1,1,0,0,0-1,1v3H25a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h3v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V30h3a1,1,0,0,0,1-1V27a1,1,0,0,0-1-1Z"></path><rect fill-rule="evenodd" height="22" rx="1" ry="1" width="14" y="8"></rect><path fill-rule="evenodd" d="M20,24a5.015,5.015,0,0,1,5-5h1a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2H16V28h2a2,2,0,0,0,2-2Z"></path><path fill-rule="evenodd" d="M10,6V4A1,1,0,0,0,9,3H5A1,1,0,0,0,4,4V6Z"></path>`;

const FilmrollAutoAdd = createWorkflowIcon('VueWorkflowFilmrollAutoAdd', svgAttributes, svgInnerHTML);

export default FilmrollAutoAdd;
