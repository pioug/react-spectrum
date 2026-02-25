import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22.105,6H22V3a.733.733,0,0,0-.739-.735.718.718,0,0,0-.513.216L13.905,9.366a.735.735,0,0,0,0,.984l6.843,7.434a.718.718,0,0,0,.513.216A.733.733,0,0,0,22,17.265V14a12.429,12.429,0,0,1,12.179,4.785A.455.455,0,0,0,35,18.513C35,16.5,32.779,6,22.105,6Z"></path><path fill-rule="evenodd" d="M12.27,18.5H12V14.735A.733.733,0,0,0,11.261,14a.718.718,0,0,0-.513.216L2.189,22.508a.735.735,0,0,0,0,.984l8.559,8.292a.718.718,0,0,0,.513.216A.733.733,0,0,0,12,31.265V27.717c6.4-1.033,12.118,2.748,15,6.379a.555.555,0,0,0,1-.332C28,31.313,25.29,18.5,12.27,18.5Z"></path>`;

const ReplyAll = createWorkflowIcon('VueWorkflowReplyAll', svgAttributes, svgInnerHTML);

export default ReplyAll;
