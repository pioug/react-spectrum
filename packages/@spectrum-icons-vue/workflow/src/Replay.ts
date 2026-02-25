import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.338,10.14a.878.878,0,0,0-.475-.14h-.931A.968.968,0,0,0,12,11V25a.968.968,0,0,0,.932,1h.931a.878.878,0,0,0,.475-.14l11.205-7a1.038,1.038,0,0,0,0-1.72Z"></path><path fill-rule="evenodd" d="M33.263,20.625l-.986-.169a.494.494,0,0,0-.568.394A14,14,0,1,1,19.883,4.127a12.5,12.5,0,0,1,8.249,5.035l-1.985,1.984A.49.49,0,0,0,26,11.5a.5.5,0,0,0,.5.5h5.052A.5.5,0,0,0,32,11.553V6.5a.5.5,0,0,0-.5-.5.494.494,0,0,0-.35.147l-1.71,1.711a12.44,12.44,0,0,0-8.957-5.664A16,16,0,0,0,5.4,27.861a16,16,0,0,0,28.274-6.642A.507.507,0,0,0,33.263,20.625Z"></path>`;

const Replay = createWorkflowIcon('VueWorkflowReplay', svgAttributes, svgInnerHTML);

export default Replay;
