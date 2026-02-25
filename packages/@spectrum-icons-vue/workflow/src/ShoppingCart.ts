import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<ellipse fill-rule="evenodd" cx="10.445" cy="31.143" rx="2.667" ry="2.917"></ellipse><ellipse fill-rule="evenodd" cx="25.778" cy="31.143" rx="2.667" ry="2.917"></ellipse><path fill-rule="evenodd" d="M29.326,24H10.469l.762-2.6H28a1.331,1.331,0,0,0,1.307-1.071L33.974,7.66a1.334,1.334,0,0,0-1.308-1.595H32.54v-.03H6.5l-1.289-3.5A1.335,1.335,0,0,0,3.889,1.4H1.333a1.334,1.334,0,0,0,0,2.667H2.739L8.667,20,7.373,25.075A1.569,1.569,0,0,0,8.667,27H29.333a1.589,1.589,0,0,0,1.334-1.6A1.4,1.4,0,0,0,29.326,24ZM7.529,8.835H30.6l-3.693,9.9H11.174Z" transform="translate(0)"></path>`;

const ShoppingCart = createWorkflowIcon('VueWorkflowShoppingCart', svgAttributes, svgInnerHTML);

export default ShoppingCart;
