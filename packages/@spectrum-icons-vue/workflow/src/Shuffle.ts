import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M3,10H7.111l2.65,4.139,3.4-5.528L10.722,4.805a2,2,0,0,0-1.6-.8H3A1,1,0,0,0,2,5V9A1,1,0,0,0,3,10Z" transform="translate(0 0)"></path><path fill-rule="evenodd" d="M27.2.206A.688.688,0,0,0,26.705,0a.7.7,0,0,0-.7.7V4H21a2,2,0,0,0-1.6.806L7.111,24H3a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H9.118a2,2,0,0,0,1.6-.8L23.03,10H26v3.3a.7.7,0,0,0,.7.7.688.688,0,0,0,.49-.206L32.88,7.325a.5.5,0,0,0,0-.65Z" transform="translate(0 0)"></path><path fill-rule="evenodd" d="M27.2,20.206a.688.688,0,0,0-.49-.206.7.7,0,0,0-.7.7V24H23.03l-2.723-4.248L16.9,25.288l2.5,3.906A2,2,0,0,0,21,30h5v3.3a.7.7,0,0,0,.7.7.688.688,0,0,0,.49-.206l5.685-6.469a.5.5,0,0,0,0-.65Z" transform="translate(0 0)"></path>`;

const Shuffle = createWorkflowIcon('VueWorkflowShuffle', svgAttributes, svgInnerHTML);

export default Shuffle;
