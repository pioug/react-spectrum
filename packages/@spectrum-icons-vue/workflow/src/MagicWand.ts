import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" transform="translate(-11.793 15.032) rotate(-45)" width="30.118" x="-2.811" y="19.752"></rect><path fill-rule="evenodd" d="M31.506,13.559l.078,2.156a1.756,1.756,0,0,0,.9,1.47l1.882,1.054-2.156.078a1.756,1.756,0,0,0-1.47.9L29.684,21.1l-.078-2.156a1.756,1.756,0,0,0-.9-1.47l-1.882-1.054,2.156-.078a1.759,1.759,0,0,0,1.47-.9Z"></path><path fill-rule="evenodd" d="M29.732.1l.108,2.99a2.437,2.437,0,0,0,1.245,2.038L33.7,6.589l-2.99.108a2.434,2.434,0,0,0-2.039,1.245l-1.462,2.61L27.1,7.562a2.44,2.44,0,0,0-1.245-2.039L23.241,4.061l2.99-.108A2.439,2.439,0,0,0,28.27,2.708Z"></path><path fill-rule="evenodd" d="M12.7,1.68l.139,3.851a3.138,3.138,0,0,0,1.6,2.625L17.8,10.04l-3.851.139a3.139,3.139,0,0,0-2.626,1.6L9.443,15.144,9.3,11.293A3.139,3.139,0,0,0,7.7,8.667L4.339,6.784,8.19,6.645a3.141,3.141,0,0,0,2.626-1.6Z"></path>`;

const MagicWand = createWorkflowIcon('VueWorkflowMagicWand', svgAttributes, svgInnerHTML);

export default MagicWand;
