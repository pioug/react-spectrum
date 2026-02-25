import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect opacity="0.9" height="28" transform="translate(-13 49) rotate(-90)" width="2" x="17" y="17"></rect><rect opacity="0.8" height="28" transform="translate(-11 47) rotate(-90)" width="2" x="17" y="15"></rect><rect opacity="0.7" height="28" transform="translate(-9 45) rotate(-90)" width="2" x="17" y="13"></rect><rect opacity="0.6" height="28" transform="translate(-7 43) rotate(-90)" width="2" x="17" y="11"></rect><rect opacity="0.5" height="28" transform="translate(-5 41) rotate(-90)" width="2" x="17" y="9"></rect><rect opacity="0.4" height="28" transform="translate(-3 39) rotate(-90)" width="2" x="17" y="7"></rect><rect opacity="0.25" height="28" transform="translate(3 33) rotate(-90)" width="2" x="17" y="1"></rect><rect opacity="0.3" height="28" transform="translate(1 35) rotate(-90)" width="2" x="17" y="3"></rect><rect opacity="0.35" height="28" transform="translate(-1 37) rotate(-90)" width="2" x="17" y="5"></rect><rect opacity="0.2" height="28" transform="translate(5 31) rotate(-90)" width="2" x="17" y="-1"></rect><rect opacity="0.15" height="28" transform="translate(7 29) rotate(-90)" width="2" x="17" y="-3"></rect><rect opacity="0.1" height="28" transform="translate(9 27) rotate(-90)" width="2" x="17" y="-5"></rect><rect opacity="0.05" height="28" transform="translate(11 25) rotate(-90)" width="2" x="17" y="-7"></rect><path fill-rule="evenodd" d="M3,34H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33A1,1,0,0,0,3,34ZM32,4V32H4V4Z"></path>`;

const LinearGradient = createWorkflowIcon('VueWorkflowLinearGradient', svgAttributes, svgInnerHTML);

export default LinearGradient;
