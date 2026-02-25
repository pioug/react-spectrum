import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16.4,35.594,2.823,28.051A1.6,1.6,0,0,1,2,26.652V13.194l14.4,8Z"></path><path fill-rule="evenodd" d="M33.177,28.051,19.6,35.594v-14.4l14.4-8V26.652A1.6,1.6,0,0,1,33.177,28.051Z"></path><path fill-rule="evenodd" d="M24.637,3.717,18.762.535a1.6,1.6,0,0,0-1.524,0L2.592,8.468a.825.825,0,0,0,0,1.451l5.529,2.995Z"></path><path fill-rule="evenodd" d="M33.408,8.468,27.97,5.523l-16.515,9.2L18,18.265,33.408,9.919A.825.825,0,0,0,33.408,8.468Z"></path>`;

const Box = createWorkflowIcon('VueWorkflowBox', svgAttributes, svgInnerHTML);

export default Box;
