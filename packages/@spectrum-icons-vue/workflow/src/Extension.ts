import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,8H30V1.215a.75.75,0,0,0-.75-.75h-1.5a.75.75,0,0,0-.75.75V8H21V1.215a.75.75,0,0,0-.75-.75h-1.5a.75.75,0,0,0-.75.75V8H16a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h.035v5.5a4.5,4.5,0,0,0,4.5,4.5H22.5v3A5.312,5.312,0,0,1,12,27V11.536a5.445,5.445,0,0,0-4.6-5.5A5.2,5.2,0,0,0,1.909,9.312a.767.767,0,0,0,.395.995l1.289.554a.783.783,0,0,0,1.048-.4A2.251,2.251,0,0,1,9,11.25V27a8.287,8.287,0,0,0,16.5,0V24h1.938a4.5,4.5,0,0,0,4.5-4.5V14H32a2,2,0,0,0,2-2V10A2,2,0,0,0,32,8Z"></path>`;

const Extension = createWorkflowIcon('VueWorkflowExtension', svgAttributes, svgInnerHTML);

export default Extension;
