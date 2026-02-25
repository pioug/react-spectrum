import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28.28793,19.93791l-9.83888,6.82687a.78769.78769,0,0,1-.8981,0L7.71207,19.93791,1.85826,24.00008a.25.25,0,0,0,0,.41078l15.8498,10.99777a.51211.51211,0,0,0,.58386,0l15.8498-10.99777a.25.25,0,0,0,0-.41078Z"></path><path fill-rule="evenodd" d="M17.6987,22.9877,1.85764,11.99639a.25.25,0,0,1,0-.4108L17.6987.59428a.52854.52854,0,0,1,.6026,0L34.14236,11.58559a.25.25,0,0,1,0,.4108L18.3013,22.9877A.52851.52851,0,0,1,17.6987,22.9877Z"></path>`;

const Layers = createWorkflowIcon('VueWorkflowLayers', svgAttributes, svgInnerHTML);

export default Layers;
