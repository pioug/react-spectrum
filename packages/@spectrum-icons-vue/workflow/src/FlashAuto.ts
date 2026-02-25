import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="6.001 2 20.001 2 12.001 14 22.001 14 2.901 36 2.001 36 8.001 20 0.251 20 6.001 2"></polygon><path fill-rule="evenodd" d="M28.418,16.417c-.026-.134-.054-.161-.189-.161H24.475c-.107,0-.161.081-.161.189A4.132,4.132,0,0,1,24.07,17.9L18.507,33.73c-.028.189.026.27.189.27h2.7a.267.267,0,0,0,.3-.216L22.954,30h6.913L31.2,33.838a.272.272,0,0,0,.271.162H34.5c.161,0,.189-.081.161-.243Zm-2.052,2.54h.026c.541,1.89,2.1,6.481,2.664,8.264h-5.3C24.569,24.764,25.934,20.766,26.366,18.957Z"></path>`;

const FlashAuto = createWorkflowIcon('VueWorkflowFlashAuto', svgAttributes, svgInnerHTML);

export default FlashAuto;
