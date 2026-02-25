import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="11.136 9.523 9.64 10.963 4.312 5.723 5.808 4.284 11.136 9.523"></polygon><polygon fill-rule="evenodd" points="31.801 30.277 30.305 31.716 25.006 26.382 26.501 24.943 31.801 30.277"></polygon><rect fill-rule="evenodd" x="11.057" y="1.79995" width="2.314" height="4.629"></rect><rect fill-rule="evenodd" x="1.8" y="11.05695" width="4.629" height="2.314"></rect><rect fill-rule="evenodd" x="29.571" y="22.62895" width="4.629" height="2.314"></rect><rect fill-rule="evenodd" x="22.629" y="29.57095" width="2.314" height="4.629"></rect><path fill-rule="evenodd" d="M18.053,23.708c-2.244,2.258-5.69,5.728-5.84,5.878a4.10122,4.10122,0,0,1-5.8-5.8l5.858-5.858L10.1,15.754,4.239,21.612A7.17607,7.17607,0,0,0,14.388,31.76l5.842-5.874Z"></path><path fill-rule="evenodd" d="M17.917,12.25795C20.161,10,23.607,6.53,23.757,6.38a4.10122,4.10122,0,1,1,5.8,5.8l-5.858,5.858,2.171,2.174,5.861-5.858a7.17607,7.17607,0,1,0-10.149-10.148L15.74,10.08Z"></path>`;

const LinkOff = createWorkflowIcon('VueWorkflowLinkOff', svgAttributes, svgInnerHTML);

export default LinkOff;
