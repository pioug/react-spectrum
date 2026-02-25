import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.029,10H14V4.8a.8.8,0,0,0-.806-.8.785.785,0,0,0-.56.236L2.207,15.464a.8.8,0,0,0,0,1.072L12.634,27.764a.785.785,0,0,0,.56.236A.8.8,0,0,0,14,27.2V22a19.71,19.71,0,0,1,18.791,6.81.67.67,0,0,0,1.209-.4C34,25.453,30.732,10,15.029,10Z"></path>`;

const Reply = createWorkflowIcon('VueWorkflowReply', svgAttributes, svgInnerHTML);

export default Reply;
