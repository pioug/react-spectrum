import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.2915,17.28833l-.79235-.79041-3.46009-8.0736A4.00019,4.00019,0,0,0,25.36243,6H10.63757A3.9999,3.9999,0,0,0,6.96106,8.42432L3.5,16.5l-.79346.79346A2.41218,2.41218,0,0,0,2,18.99915V33a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1V28H30v5a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V18.996A2.41193,2.41193,0,0,0,33.2915,17.28833ZM9.25891,9.40906A1.49824,1.49824,0,0,1,10.63757,8.5H25.36243a1.4984,1.4984,0,0,1,1.37878.90906L29.5658,16H6.4342ZM8,25a3,3,0,1,1,3-3A3,3,0,0,1,8,25Zm20,0a3,3,0,1,1,3-3A3,3,0,0,1,28,25Z"></path>`;

const Car = createWorkflowIcon('VueWorkflowCar', svgAttributes, svgInnerHTML);

export default Car;
