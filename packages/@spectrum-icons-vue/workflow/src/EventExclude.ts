import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.935,6.935,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path><path fill-rule="evenodd" d="M18.7,17.944l-9.842-9.8A.488.488,0,0,0,8.5,8a.5.5,0,0,0-.5.5V31.282a.5.5,0,0,0,.5.5.489.489,0,0,0,.35-.148L14,24.656l.928.007A12.263,12.263,0,0,1,18.7,17.944Z"></path><path fill-rule="evenodd" d="M4,4H20V16.892a12.234,12.234,0,0,1,4-1.808V0H0V24H6V20H4Z"></path>`;

const EventExclude = createWorkflowIcon('VueWorkflowEventExclude', svgAttributes, svgInnerHTML);

export default EventExclude;
