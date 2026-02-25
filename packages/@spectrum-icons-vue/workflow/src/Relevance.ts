import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4.225,15.585a13.987,13.987,0,0,1,11.36-11.36A.494.494,0,0,0,16,3.74V2.721a.5.5,0,0,0-.578-.5,15.992,15.992,0,0,0-13.2,13.2.5.5,0,0,0,.5.578H3.74A.494.494,0,0,0,4.225,15.585Z"></path><path fill-rule="evenodd" d="M20.415,4.225a13.987,13.987,0,0,1,11.36,11.36A.494.494,0,0,0,32.26,16h1.019a.5.5,0,0,0,.5-.578,15.992,15.992,0,0,0-13.2-13.2.5.5,0,0,0-.578.5V3.74A.494.494,0,0,0,20.415,4.225Z"></path><path fill-rule="evenodd" d="M15.585,31.775a13.987,13.987,0,0,1-11.36-11.36A.494.494,0,0,0,3.74,20H2.721a.5.5,0,0,0-.5.578,15.992,15.992,0,0,0,13.2,13.2.5.5,0,0,0,.578-.5V32.26A.494.494,0,0,0,15.585,31.775Z"></path><path fill-rule="evenodd" d="M31.775,20.415a13.987,13.987,0,0,1-11.36,11.36A.494.494,0,0,0,20,32.26v1.019a.5.5,0,0,0,.578.5,15.992,15.992,0,0,0,13.2-13.2.5.5,0,0,0-.5-.578H32.26A.494.494,0,0,0,31.775,20.415Z"></path><circle fill-rule="evenodd" cx="18" cy="18" r="6"></circle>`;

const Relevance = createWorkflowIcon('VueWorkflowRelevance', svgAttributes, svgInnerHTML);

export default Relevance;
