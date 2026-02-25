import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6.17,7.266a15.805,15.805,0,0,0-3.4,15.558h8.565Z"></path><path fill-rule="evenodd" d="M24.515,3.411A15.843,15.843,0,0,0,8.786,4.94l2.643,7.966Z"></path><path fill-rule="evenodd" d="M33.942,19.154c.03-.382.058-.764.058-1.154A15.951,15.951,0,0,0,27.542,5.188L21.043,9.9Z"></path><path fill-rule="evenodd" d="M26.85,18.026,21.844,33.508A16,16,0,0,0,33.292,22.646Z"></path><path fill-rule="evenodd" d="M18.31,33.984l2.568-7.944H4.183A15.98,15.98,0,0,0,18,34C18.105,34,18.207,33.992,18.31,33.984Z"></path>`;

const Exposure = createWorkflowIcon('VueWorkflowExposure', svgAttributes, svgInnerHTML);

export default Exposure;
