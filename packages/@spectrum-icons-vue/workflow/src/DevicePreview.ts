import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34,4H2A2,2,0,0,0,0,6V30a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V6A2,2,0,0,0,34,4ZM30,28H4V8H30Zm3-7.5A2.5,2.5,0,1,1,35.5,18,2.5,2.5,0,0,1,33,20.5Z"></path><path fill-rule="evenodd" d="M20.779,12.617A8.563,8.563,0,0,0,17,11.678c-4.951,0-9,4.929-9,6.528,0,1.713,4.262,6.116,8.964,6.116,4.74,0,9.036-4.4,9.036-6.116C26,16.855,23.592,14.011,20.779,12.617ZM17,23.271A5.271,5.271,0,1,1,22.271,18,5.271,5.271,0,0,1,17,23.271Z"></path><path fill-rule="evenodd" d="M18.524,18.048A1.524,1.524,0,0,1,17,16.524a1.5,1.5,0,0,1,.771-1.3,2.811,2.811,0,0,0-.771-.12A2.893,2.893,0,1,0,19.893,18a2.7,2.7,0,0,0-.1-.683A1.5,1.5,0,0,1,18.524,18.048Z"></path>`;

const DevicePreview = createWorkflowIcon('VueWorkflowDevicePreview', svgAttributes, svgInnerHTML);

export default DevicePreview;
