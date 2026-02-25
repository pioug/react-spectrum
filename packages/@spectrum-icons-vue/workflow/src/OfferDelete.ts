import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,4H12V6h4Zm6,0H18V6h4ZM2,6H4V4H2A2,2,0,0,0,0,6V8H2Zm32,8h2V10H34Zm0,2.893a12.279,12.279,0,0,1,2,1.743V16H34ZM24,6h4V4H24ZM34,4H30V6h4V8h2V6A2,2,0,0,0,34,4ZM2,10H0v4H2Zm0,6H0v4H2Zm16.213-1.861L16.22,8.911a.235.235,0,0,0-.439,0l-1.993,5.228L8.158,14.4a.233.233,0,0,0-.137.415l4.4,3.5L10.934,23.7a.234.234,0,0,0,.355.257L16,20.894l.238.155a12.322,12.322,0,0,1,7.235-5.83l.5-.4a.233.233,0,0,0-.137-.415ZM14,30v2h1.769a12.223,12.223,0,0,1-.685-2ZM8,32h4V30H8ZM10,4H6V6h4ZM2,22H0v4H2Zm0,6H0v2a2,2,0,0,0,2,2H6V30H2Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path>`;

const OfferDelete = createWorkflowIcon('VueWorkflowOfferDelete', svgAttributes, svgInnerHTML);

export default OfferDelete;
