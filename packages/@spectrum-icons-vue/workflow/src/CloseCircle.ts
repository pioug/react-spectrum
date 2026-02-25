import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.314,6.686a16,16,0,1,0,0,22.627A16,16,0,0,0,29.314,6.686ZM26.627,25.213l-1.414,1.414a1.2,1.2,0,0,1-1.7,0L18,21.111l-5.516,5.516a1.2,1.2,0,0,1-1.7,0L9.375,25.212a1.2,1.2,0,0,1,0-1.7L14.889,18,9.375,12.484a1.2,1.2,0,0,1,0-1.7l1.414-1.414a1.2,1.2,0,0,1,1.7,0L18,14.888l5.516-5.515a1.2,1.2,0,0,1,1.7,0l1.414,1.414a1.2,1.2,0,0,1,0,1.7L21.111,18l5.516,5.516a1.2,1.2,0,0,1,0,1.7Z"></path>`;

const CloseCircle = createWorkflowIcon('VueWorkflowCloseCircle', svgAttributes, svgInnerHTML);

export default CloseCircle;
