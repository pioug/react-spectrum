import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm-8.763-2.172a.362.362,0,0,1,.171-.373,5.889,5.889,0,0,1,2.035-.408,6.662,6.662,0,0,1,2.071.306.424.424,0,0,1,.2.374V14.17a78.132,78.132,0,0,1-.679,7.884c0,.1-.033.2-.237.2H11.087a.224.224,0,0,1-.237-.2c-.069-.951-.612-4.931-.612-7.782Zm2.206,18.6a2.635,2.635,0,0,1-2.9-2.7,2.739,2.739,0,0,1,2.9-2.777,2.7,2.7,0,0,1,2.9,2.777A2.635,2.635,0,0,1,12.443,30.429Z"></path><polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon>`;

const FileImportant = createWorkflowIcon('VueWorkflowFileImportant', svgAttributes, svgInnerHTML);

export default FileImportant;
