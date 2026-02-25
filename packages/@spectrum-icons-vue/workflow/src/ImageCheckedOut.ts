import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V27a1,1,0,0,0,1,1H15.55042c-.02857-.3302-.05042-.66235-.05042-1a11.45188,11.45188,0,0,1,3.205-7.9519l-5.43287-5.43287a2,2,0,0,0-2.82849,0L4,20.05884V6H32V16.29822A10.45162,10.45162,0,0,1,34,17.4V5A1,1,0,0,0,33,4ZM26.7,8.6A2.7,2.7,0,1,0,29.4,11.30005,2.7,2.7,0,0,0,26.7,8.6Z"></path><path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm5,10.81421a.5.5,0,0,1-.85352.35351l-2.09643-2.09643-4.63587,4.63586a.5.5,0,0,1-.707,0l-1.4143-1.4143a.5.5,0,0,1,0-.707L26.92871,24.95l-2.09656-2.09643A.5.5,0,0,1,25.18579,22H31.7135A.28654.28654,0,0,1,32,22.2865Z"></path>`;

const ImageCheckedOut = createWorkflowIcon('VueWorkflowImageCheckedOut', svgAttributes, svgInnerHTML);

export default ImageCheckedOut;
