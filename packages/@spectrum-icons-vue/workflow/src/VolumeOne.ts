import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6.745,12.073H1a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H6.745a1.428,1.428,0,0,1,.931.345l7.13,7.259A.727.727,0,0,0,16,31.029V5a.726.726,0,0,0-1.194-.571l-7.127,7.3A1.44,1.44,0,0,1,6.745,12.073Z"></path><path fill-rule="evenodd" d="M22.04,18a6.935,6.935,0,0,1-1.407,4.192.98.98,0,0,0,.086,1.288l.016.016a.992.992,0,0,0,1.487-.09A8.955,8.955,0,0,0,22.2,12.553a.992.992,0,0,0-1.484-.087l-.015.016a.982.982,0,0,0-.085,1.292A6.943,6.943,0,0,1,22.04,18Z"></path>`;

const VolumeOne = createWorkflowIcon('VueWorkflowVolumeOne', svgAttributes, svgInnerHTML);

export default VolumeOne;
