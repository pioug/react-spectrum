import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="13.823 20.473 8 36 8.9 36 18.393 25.065 13.823 20.473"></polygon><polygon fill-rule="evenodd" points="18.26 13.609 26 2 12 2 10.714 6.026 18.26 13.609"></polygon><polygon fill-rule="evenodd" points="23.643 19.019 28 14 18.649 14 23.643 19.019"></polygon><polygon fill-rule="evenodd" points="7.976 14.598 6.25 20 13.352 20 7.976 14.598"></polygon><rect fill-rule="evenodd" height="43.854" rx="0.818" ry="0.818" transform="translate(-8.163 18.293) rotate(-45)" width="2.455" x="16.773" y="-2.926"></rect>`;

const FlashOff = createWorkflowIcon('VueWorkflowFlashOff', svgAttributes, svgInnerHTML);

export default FlashOff;
