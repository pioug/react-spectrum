import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.332,28c-.216,0-.288-.076-.288-.264v-8.95a13.766,13.766,0,0,1-3.709,1.325c-.216.037-.288,0-.288-.227v-3.2c0-.188.036-.263.216-.3A16.954,16.954,0,0,0,19.2,14.151a.913.913,0,0,1,.54-.151H21.8c.143,0,.18.076.18.264V27.736c0,.188-.073.264-.216.264Z"></path><path fill-rule="evenodd" d="M35,6H30V3a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1V6H12V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V6H3A1,1,0,0,0,2,7V33a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V7A1,1,0,0,0,35,6ZM34,32H4V8H8V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8H26V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h4Z"></path>`;

const ViewDay = createWorkflowIcon('VueWorkflowViewDay', svgAttributes, svgInnerHTML);

export default ViewDay;
