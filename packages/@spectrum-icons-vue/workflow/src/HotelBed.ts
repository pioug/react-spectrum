import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.2,22H.80005L6,14H30ZM0,24v5a1,1,0,0,0,1,1H4v1.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30H30v1.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30h3a1,1,0,0,0,1-1V24ZM8,11a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v1h4V11a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v1h2V7a1,1,0,0,0-1-1H7A1,1,0,0,0,6,7v5H8Z"></path>`;

const HotelBed = createWorkflowIcon('VueWorkflowHotelBed', svgAttributes, svgInnerHTML);

export default HotelBed;
