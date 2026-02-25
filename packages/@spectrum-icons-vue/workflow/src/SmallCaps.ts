import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22.5,18a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V20h4V30H26.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H30V20h4v1.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5v-3a.5.5,0,0,0-.5-.5Z"></path><path fill-rule="evenodd" d="M27,4a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1H25a1,1,0,0,1-1-1V8H16V28h3a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V29a1,1,0,0,1,1-1h3V8H4v3a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V5A1,1,0,0,1,1,4Z"></path>`;

const SmallCaps = createWorkflowIcon('VueWorkflowSmallCaps', svgAttributes, svgInnerHTML);

export default SmallCaps;
