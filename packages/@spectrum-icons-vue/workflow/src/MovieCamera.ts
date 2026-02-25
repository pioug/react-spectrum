import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32.4,10.2,24,16.5V9.818A1.818,1.818,0,0,0,22.182,8H5.818A1.818,1.818,0,0,0,4,9.818V26.182A1.818,1.818,0,0,0,5.818,28H22.182A1.818,1.818,0,0,0,24,26.182V19.5l8.4,6.3A1,1,0,0,0,34,25V11A1,1,0,0,0,32.4,10.2Z"></path>`;

const MovieCamera = createWorkflowIcon('VueWorkflowMovieCamera', svgAttributes, svgInnerHTML);

export default MovieCamera;
