import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,30H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H31a1,1,0,0,1,1,1V29A1,1,0,0,1,31,30ZM30,6H6v6H30Zm0,8H6v6H30Zm0,8H6v6H30Z"></path>`;

const Feed = createWorkflowIcon('VueWorkflowFeed', svgAttributes, svgInnerHTML);

export default Feed;
