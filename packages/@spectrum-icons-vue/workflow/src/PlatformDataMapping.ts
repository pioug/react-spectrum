import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.32753,20.0047a4.98752,4.98752,0,0,0-6.07314,3.32863H10V18.93514a.5.5,0,0,0-.82918-.37626L2.43005,24.457a.5.5,0,0,0,0,.75258L9.17073,31.1077A.5.5,0,0,0,10,30.7314V26.33333H24.25439a4.993,4.993,0,1,0,6.07314-6.32863ZM5.67183,13.66178a4.98757,4.98757,0,0,0,6.07378-3.32845H26v4.39814a.5.5,0,0,0,.82922.37628L33.57,9.20962a.5.5,0,0,0,0-.75258L26.82922,2.55892A.5.5,0,0,0,26,2.9352V7.33333H11.74561a4.993,4.993,0,1,0-6.07378,6.32845Z"></path>`;

const PlatformDataMapping = createWorkflowIcon('VueWorkflowPlatformDataMapping', svgAttributes, svgInnerHTML);

export default PlatformDataMapping;
