import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H5.314a8.995,8.995,0,0,1,1.949-2H4V10H32V28H28.563a9.453,9.453,0,0,1,2.024,2H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4Z"></path><path fill-rule="evenodd" d="M21.213,27.051V25.377a1.159,1.159,0,0,1,.295-.747,8.842,8.842,0,0,0,2.01-5.517c0-4.175-2.214-6.508-5.56-6.508s-5.623,2.425-5.623,6.508a8.936,8.936,0,0,0,2.107,5.517,1.159,1.159,0,0,1,.295.747v1.667a1.15,1.15,0,0,1-1,1.16c-6.722.585-7.727,5.183-7.727,7,0,.2-.007.8-.007.8H30v-.8c0-1.738-1.187-6.32-7.788-6.99A1.155,1.155,0,0,1,21.213,27.051Z"></path>`;

const Visit = createWorkflowIcon('VueWorkflowVisit', svgAttributes, svgInnerHTML);

export default Visit;
