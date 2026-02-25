import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,4H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4ZM34,30H30.544c-1.238-1.822-3.516-3.556-7.63-3.974a1.335,1.335,0,0,1-1.155-1.34V22.753a1.341,1.341,0,0,1,.34-.863,10.209,10.209,0,0,0,2.323-6.372C24.422,10.695,21.865,8,18,8s-6.5,2.8-6.5,7.517a10.324,10.324,0,0,0,2.434,6.372,1.336,1.336,0,0,1,.341.863v1.925a1.328,1.328,0,0,1-1.159,1.34C8.876,26.388,6.6,28.143,5.4,30H2V6H34Z"></path>`;

const ImageProfile = createWorkflowIcon('VueWorkflowImageProfile', svgAttributes, svgInnerHTML);

export default ImageProfile;
