import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.70313,15.507,18.493.297a1.014,1.014,0,0,0-.7171-.2969H5.014A1.014,1.014,0,0,0,4,1.014v12.762a1.01465,1.01465,0,0,0,.2969.7171l15.21012,15.21a1.01441,1.01441,0,0,0,1.43417,0L33.70313,16.941A1.01428,1.01428,0,0,0,33.70313,15.507ZM11,10a3,3,0,1,1,3-2.99988A3.00023,3.00023,0,0,1,11,10Z"></path><path fill-rule="evenodd" d="M33.703,21.70693l-.80409-.7926L20.94083,32.70707a1.024,1.024,0,0,1-1.43379,0L4.2971,17.70715A.99237.99237,0,0,1,4,16.99995v3a.994.994,0,0,0,.2971.7076L19.507,35.70745a1.02474,1.02474,0,0,0,1.43379,0L33.703,23.12152A.99065.99065,0,0,0,33.703,21.70693Z"></path>`;

const Labels = createWorkflowIcon('VueWorkflowLabels', svgAttributes, svgInnerHTML);

export default Labels;
