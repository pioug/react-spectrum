import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="3.685" r="3.685"></circle><path fill-rule="evenodd" d="M12.861,13.247l.518,6.039L9.271,26.354a.558.558,0,0,0,.537.712h4.215l1.654,8.485a.555.555,0,0,0,.545.449h3.557a.555.555,0,0,0,.545-.449l1.654-8.485h4.215a.558.558,0,0,0,.537-.712l-4.07-7.068.487-6.056a3.873,3.873,0,0,0-1.829-3.745A3.933,3.933,0,0,0,19.421,9H16.579a3.934,3.934,0,0,0-1.89.482A3.87,3.87,0,0,0,12.861,13.247Z"></path>`;

const GenderFemale = createWorkflowIcon('VueWorkflowGenderFemale', svgAttributes, svgInnerHTML);

export default GenderFemale;
