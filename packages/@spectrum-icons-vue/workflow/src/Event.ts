import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.5,10.054a.494.494,0,0,0-.5.5V35.336a.494.494,0,0,0,.846.354L26.51,28h9c.445,0,.479-.726.225-.98S18.846,10.2,18.846,10.2A.489.489,0,0,0,18.5,10.054Z"></path><polygon fill-rule="evenodd" points="13.991 30 5.997 30 5.997 6 30 6 30 14 34 18 34 2 2 2 2 34 13.991 34 13.991 30"></polygon>`;

const Event = createWorkflowIcon('VueWorkflowEvent', svgAttributes, svgInnerHTML);

export default Event;
