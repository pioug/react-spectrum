import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.059,5.082l3.554,9.5,10.219.481-7.974,6.4L26.529,31.3l-8.535-5.568L9.437,31.347l2.7-9.873-7.974-6.4,10.2-.489ZM18.082.823a.737.737,0,0,0-.7.479L12.971,12.651l-12.2.586a.75.75,0,0,0-.433,1.334l9.523,7.642-3.229,11.8a.752.752,0,0,0,.724.951.74.74,0,0,0,.41-.126L18,28.122,28.187,34.77a.742.742,0,0,0,.408.125.752.752,0,0,0,.725-.95L26.131,22.213l9.528-7.653a.75.75,0,0,0-.434-1.334l-12.2-.575-4.24-11.34A.738.738,0,0,0,18.082.823Z"></path>`;

const StarOutline = createWorkflowIcon('VueWorkflowStarOutline', svgAttributes, svgInnerHTML);

export default StarOutline;
