import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="20.757" cy="19.283" r="2.5"></circle><path fill-rule="evenodd" d="M20.865.409l.1,2.842A2.318,2.318,0,0,0,22.151,5.19l2.482,1.39-2.843.1a2.317,2.317,0,0,0-1.938,1.184l-1.39,2.482-.1-2.843a2.317,2.317,0,0,0-1.184-1.939l-2.482-1.39,2.843-.1A2.318,2.318,0,0,0,19.475,2.89Z"></path><path fill-rule="evenodd" d="M29.686,5.541,29.819,9.2a2.984,2.984,0,0,0,1.524,2.5l3.2,1.79-3.661.133a2.982,2.982,0,0,0-2.5,1.524l-1.791,3.2-.132-3.661a2.986,2.986,0,0,0-1.525-2.5l-3.2-1.791,3.661-.132a2.987,2.987,0,0,0,2.5-1.525Z"></path><path fill-rule="evenodd" d="M26,22v6.463l-3.687-3.686a2,2,0,0,0-2.828,0l-3.071,3.071L8.858,20.292a2,2,0,0,0-2.829,0L2,24.321V14H23l-3-2H1a1,1,0,0,0-1,1V31a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1V19Z"></path>`;

const ImageAutoMode = createWorkflowIcon('VueWorkflowImageAutoMode', svgAttributes, svgInnerHTML);

export default ImageAutoMode;
