import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8.537,16.86-12.027,7A1,1,0,0,1,14,26H13a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1h1a1,1,0,0,1,.51.14l12.027,7A1,1,0,0,1,26.537,18.86Z"></path>`;

const PlayCircle = createWorkflowIcon('VueWorkflowPlayCircle', svgAttributes, svgInnerHTML);

export default PlayCircle;
