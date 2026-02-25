import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34.93944,16H1.06054a.8.8,0,0,1-.76916-1.01978l3.50134-12.255A1,1,0,0,1,4.75428,2H31.24572a1,1,0,0,1,.96156.72522l3.50134,12.255A.8.8,0,0,1,34.93944,16ZM30,18v6H14V18H12V32H6V18H4V32a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V18ZM4,14H6L8,4H6Zm8.5,0h2l1-10h-2Zm8-10,1,10h2l-1-10ZM30,4H28l2,10h2Z"></path>`;

const Shop = createWorkflowIcon('VueWorkflowShop', svgAttributes, svgInnerHTML);

export default Shop;
