import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="15.8" cy="13.393" r="2.5"></circle><path fill-rule="evenodd" d="M29.668,23.722,35.8,18l-6.132-5.708A1,1,0,0,0,28,13.035V16H20.5a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5H28v2.978A1,1,0,0,0,29.668,23.722Z"></path><path fill-rule="evenodd" d="M24.875,6H1.125A1.068,1.068,0,0,0,0,7V29a1.068,1.068,0,0,0,1.125,1h23.75A1.068,1.068,0,0,0,26,29V22H24v2c-1.791-1.058-3.067-1.84-4.628-1.84-2.938,0-2.893,2.029-5.833,2.029s-3.274-4.438-6.213-4.438C4.654,19.751,2,24,2,24V8H24v6h2V7A1.068,1.068,0,0,0,24.875,6Z"></path>`;

const ImageNext = createWorkflowIcon('VueWorkflowImageNext', svgAttributes, svgInnerHTML);

export default ImageNext;
