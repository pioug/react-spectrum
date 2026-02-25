import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.332,20.25,18.75,3.668a1.063,1.063,0,0,0-1.5,0L.668,20.25a1.061,1.061,0,0,0,0,1.5l1.958,1.957A1,1,0,0,0,3.333,24H4v9a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V23a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1V33a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V24h.667a1,1,0,0,0,.707-.293l1.958-1.957A1.061,1.061,0,0,0,35.332,20.25Z"></path>`;

const Home = createWorkflowIcon('VueWorkflowHome', svgAttributes, svgInnerHTML);

export default Home;
