import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,18,31.95349,4.99634a1,1,0,0,0-1-.99634H22V1a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V4H5A1,1,0,0,0,4,5V18l13.97327-2.99426ZM8,8H28v2H8Z"></path><path fill-rule="evenodd" d="M35.21692,21.82593,18,18l2,18,9.04358-.00012a.98894.98894,0,0,0,1-.84754C30.58508,30.1062,36,30.9624,36,26V22.80212A1.0001,1.0001,0,0,0,35.21692,21.82593Z"></path><path fill-rule="evenodd" d="M0,22.80212V26c0,4.9624,5.41492,4.1062,5.95642,9.15234a.98894.98894,0,0,0,1,.84754L18,36V18L.78308,21.82593A1.0001,1.0001,0,0,0,0,22.80212Z"></path>`;

const Ship = createWorkflowIcon('VueWorkflowShip', svgAttributes, svgInnerHTML);

export default Ship;
