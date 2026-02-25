import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,3.417a1,1,0,0,0-1.268-.965l-16,4.447A1,1,0,0,0,12,7.863v16.55a6.628,6.628,0,0,0-6.144.057c-3.113,1.515-4.687,4.7-3.515,7.1S6.987,34.706,10.1,33.19A6.434,6.434,0,0,0,14,27.857c0-.167,0-15.033,0-15.033l14-4V20.413a6.628,6.628,0,0,0-6.144.057c-3.113,1.515-4.687,4.7-3.515,7.1s4.646,3.132,7.759,1.616A6.427,6.427,0,0,0,30,23.833C30,23.767,30,3.417,30,3.417Z"></path>`;

const Audio = createWorkflowIcon('VueWorkflowAudio', svgAttributes, svgInnerHTML);

export default Audio;
