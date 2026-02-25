import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M17.682,31.663c-.041.213-.08.3-.282.3H13.32c-.2,0-.279-.043-.24-.341L17.561,4.255c.041-.213.16-.255.281-.255h4.121c.24,0,.279.127.279.34Z"></path>`;

const TagItalic = createWorkflowIcon('VueWorkflowTagItalic', svgAttributes, svgInnerHTML);

export default TagItalic;
