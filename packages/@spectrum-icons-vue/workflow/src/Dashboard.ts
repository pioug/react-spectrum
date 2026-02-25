import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M7.324,28.053a13.27,13.27,0,0,1-2.656-7.794A13.483,13.483,0,0,1,17.612,6.741,13.331,13.331,0,0,1,28.676,28.053a.725.725,0,0,0,.1,1l.931.775a.733.733,0,0,0,1.048-.107,16,16,0,1,0-25.515,0,.729.729,0,0,0,1.045.107l.932-.776A.724.724,0,0,0,7.324,28.053Z"></path><path fill-rule="evenodd" d="M20.839,23.526a2.909,2.909,0,1,1-3.474-2.2c.748-.167,5.534-6.2,6.146-5.845C24.184,15.871,20.656,22.706,20.839,23.526Z"></path><circle fill-rule="evenodd" cx="7.818" cy="20.069" r="1.6"></circle><circle fill-rule="evenodd" cx="10.727" cy="12.796" r="1.6"></circle><circle fill-rule="evenodd" cx="25.273" cy="12.796" r="1.455"></circle><circle fill-rule="evenodd" cx="18" cy="9.887" r="1.455"></circle><circle fill-rule="evenodd" cx="28.182" cy="20.069" r="1.455"></circle>`;

const Dashboard = createWorkflowIcon('VueWorkflowDashboard', svgAttributes, svgInnerHTML);

export default Dashboard;
