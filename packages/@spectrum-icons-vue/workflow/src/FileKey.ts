import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M22.821,24.77a1.856,1.856,0,1,0,1.857,1.856A1.855,1.855,0,0,0,22.821,24.77ZM19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm2.154,15.952a4.395,4.395,0,0,1-3.683-3.686,4.49,4.49,0,0,1,.048-1.569L15.4,22.509V20.552H13.037a.339.339,0,0,1-.338-.337V17.853H10.338A.338.338,0,0,1,10,17.516V14.142a.338.338,0,0,1,.338-.337h1.546a.349.349,0,0,1,.239.1l7.766,7.766a4.342,4.342,0,0,1,2-.442,4.451,4.451,0,0,1,4.3,4.682A4.387,4.387,0,0,1,21.154,29.952Z"></path>`;

const FileKey = createWorkflowIcon('VueWorkflowFileKey', svgAttributes, svgInnerHTML);

export default FileKey;
