import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28.971,34H7a1.117,1.117,0,0,1-.953-1.477L7.879,26H28.093l1.831,6.523A1.117,1.117,0,0,1,28.971,34Z"></path><path fill-rule="evenodd" d="M32.85,2.676,30.777,5.139A2.623,2.623,0,0,0,30.3,7.665l1.027,3.051L28.861,8.643a2.623,2.623,0,0,0-2.525-.479L23.284,9.19l2.073-2.463A2.623,2.623,0,0,0,25.837,4.2L24.81,1.15l2.463,2.073A2.623,2.623,0,0,0,29.8,3.7Z"></path><path fill-rule="evenodd" d="M29.135,13.316l-2.129-1.791-2.637.887A3.4,3.4,0,0,1,20.684,7l1.791-2.129L22.06,3.638A12.352,12.352,0,0,0,9,24H26.291A12.316,12.316,0,0,0,30,15.176a12.576,12.576,0,0,0-.075-1.363A3.416,3.416,0,0,1,29.135,13.316Z"></path>`;

const Forecast = createWorkflowIcon('VueWorkflowForecast', svgAttributes, svgInnerHTML);

export default Forecast;
