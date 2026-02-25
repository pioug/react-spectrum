import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="26.5" cy="13.5" r="2.5"></circle><path fill-rule="evenodd" d="M33,6H3A1,1,0,0,0,2,7v3H1a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H2v8H1a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H2v3a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM6,25a1,1,0,0,1-1,1H4V22H5a1,1,0,0,1,1,1ZM6,13a1,1,0,0,1-1,1H4V10H5a1,1,0,0,1,1,1ZM32,25.748l-4.519-4.519a1.713,1.713,0,0,0-2.424,0l-2.633,2.632-6.476-6.477a1.716,1.716,0,0,0-2.425,0L8,22.908V8H32Z"></path>`;

const ImageAlbum = createWorkflowIcon('VueWorkflowImageAlbum', svgAttributes, svgInnerHTML);

export default ImageAlbum;
