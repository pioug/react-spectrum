import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="11.136 9.523 9.64 10.963 4.312 5.723 5.808 4.284 11.136 9.523"></polygon><polygon fill-rule="evenodd" points="31.801 30.277 30.305 31.716 25.006 26.382 26.501 24.943 31.801 30.277"></polygon><rect fill-rule="evenodd" height="4.629" width="2.314" x="11.057" y="1.8"></rect><rect fill-rule="evenodd" height="2.314" width="4.629" x="1.8" y="11.057"></rect><rect fill-rule="evenodd" height="2.314" width="4.629" x="29.571" y="22.629"></rect><rect fill-rule="evenodd" height="4.629" width="2.314" x="22.629" y="29.571"></rect><path fill-rule="evenodd" d="M18.053,23.708l-5.84,5.878a4.1,4.1,0,1,1-5.8-5.8l5.858-5.859L10.1,15.754,4.239,21.612A7.176,7.176,0,0,0,14.388,31.76l5.841-5.874Z"></path><path fill-rule="evenodd" d="M17.912,12.256l5.81-5.777a4.1,4.1,0,0,1,5.8,5.8c-.516.516-3.856,3.855-5.793,5.793L25.9,20.246,31.7,14.453A7.176,7.176,0,1,0,21.547,4.3c-.235.235-3.241,3.227-5.807,5.78Z"></path>`;

const Unlink = createWorkflowIcon('VueWorkflowUnlink', svgAttributes, svgInnerHTML);

export default Unlink;
