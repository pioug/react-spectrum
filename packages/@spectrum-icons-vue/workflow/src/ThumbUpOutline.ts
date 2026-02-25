import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.844,12.008l-6.55.01a21.474,21.474,0,0,0,.8-6.08C24.023,3.814,22.547,2,20.921,2A3.327,3.327,0,0,0,17.64,5.164c-.471,4.555-5.253,8.263-7.768,9.373A.99.99,0,0,0,9,14H3a1,1,0,0,0-1,1V31a1,1,0,0,0,1,1H9a1,1,0,0,0,1-1V30c4.671,0,12.447,0,14.444,0a4.636,4.636,0,0,0,4.126-2.423L32.554,16.3A3,3,0,0,0,29.844,12.008Zm.9,3.424L26.732,26.788A1.842,1.842,0,0,1,24.99,28.02L10,28V16.6c2.867-1.153,9.15-5.525,9.64-11.4A1.374,1.374,0,0,1,20.921,4c.61,0,1.121.742,1.173,1.938A15.049,15.049,0,0,1,20.348,14h9.5A1,1,0,0,1,30.749,15.432Z"></path><path fill-rule="evenodd" d="M25.458,30h0Z"></path>`;

const ThumbUpOutline = createWorkflowIcon('VueWorkflowThumbUpOutline', svgAttributes, svgInnerHTML);

export default ThumbUpOutline;
