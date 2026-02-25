import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24.213,18.021A15.517,15.517,0,0,0,35.563,5.145,1,1,0,0,0,34.571,4H27.865C27.954,2.7,28,1.366,28,0H8c0,1.366.046,2.7.135,4H1.429A.993.993,0,0,0,.438,5.145,15.514,15.514,0,0,0,11.787,18.021,9.169,9.169,0,0,0,16,22v8c-3.144.82-5.866,2.849-6.682,6H26.682c-.816-3.151-3.538-5.18-6.682-6V22A9.169,9.169,0,0,0,24.213,18.021ZM33.4,6c-.839,2.9-2.582,7.347-7.945,9.526A35.182,35.182,0,0,0,27.688,6ZM2.6,6H8.312a35.175,35.175,0,0,0,2.234,9.525C5.182,13.346,3.439,8.9,2.6,6Z"></path>`;

const Trophy = createWorkflowIcon('VueWorkflowTrophy', svgAttributes, svgInnerHTML);

export default Trophy;
