import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.978.377A34.727,34.727,0,0,0,9.586,21.99a.522.522,0,0,0,.125.545l3.752,3.751a.522.522,0,0,0,.541.127A34.428,34.428,0,0,0,35.619,1.018.544.544,0,0,0,34.978.377Z" id="Fill"></path><path fill-rule="evenodd" d="M7.8,19.148H.9a.524.524,0,0,1-.46-.783C2.021,15.609,7.92,6.52,16.848,6.52,14.776,8.591,7.962,17.569,7.8,19.148Z" id="Fill2"></path><path fill-rule="evenodd" d="M16.848,28.2v6.908a.524.524,0,0,0,.779.461c2.752-1.554,11.849-7.376,11.849-16.419C27.4,21.22,18.426,28.034,16.848,28.2Z" id="Fill3"></path>`;

const Launch = createWorkflowIcon('VueWorkflowLaunch', svgAttributes, svgInnerHTML);

export default Launch;
