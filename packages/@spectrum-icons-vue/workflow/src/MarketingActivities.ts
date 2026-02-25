import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25.865,6.9a4.853,4.853,0,0,1-1.508,1.315l3.91,4.729a4.859,4.859,0,0,1,1.559-1.253ZM9.015,15.769l4.268,3.386a4.843,4.843,0,0,1,1.312-1.512l-4.31-3.419A4.852,4.852,0,0,1,9.015,15.769Zm12.71,3.4a4.79,4.79,0,0,1,.584,1.928l5.623-2.473a4.809,4.809,0,0,1-.706-1.875ZM7.042,28.255A4.851,4.851,0,0,1,8.3,29.809l5.88-4.791a4.864,4.864,0,0,1-1.152-1.641ZM10.136,9.5a4.8,4.8,0,0,1,.657,1.938L18.2,6.98a4.8,4.8,0,0,1-.89-1.8Z"></path><circle fill-rule="evenodd" cx="4" cy="32" r="3.85"></circle><circle fill-rule="evenodd" cx="17.5" cy="21.5" r="3.85"></circle><circle fill-rule="evenodd" cx="22" cy="4" r="3.85"></circle><circle fill-rule="evenodd" cx="6" cy="12" r="3.85"></circle><circle fill-rule="evenodd" cx="32" cy="16" r="3.85"></circle>`;

const MarketingActivities = createWorkflowIcon('VueWorkflowMarketingActivities', svgAttributes, svgInnerHTML);

export default MarketingActivities;
