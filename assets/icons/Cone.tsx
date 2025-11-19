import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, RadialGradient, Stop, G, Filter,FeFlood,FeBlend ,FeGaussianBlur} from 'react-native-svg';

export default function GoldIcon({ width = 274, height = 320 }) {
  return (
    <Svg
      width="274"
      height="320"
      viewBox="0 0 274 320"
      fill="none"
      //  xmlns="http://www.w3.org/2000/svg"
    >
      <Circle cx="137.5" cy="215.5" r="104.5" fill="#055D10" />
      <Circle cx="137.5" cy="199.5" r="104.5" fill="#0A9A13" />
      <G filter="url(#filter0_f_0_1)">
        <Path
          d="M170.316 102L175.087 102L160.59 106.818L140.875 110.05L120 108.838L133.488 228.418V249L153.544 245.486L175.087 243.98L195.139 233.94L223.133 219.014L208.5 205L205.5 195L203.19 180.726L192.456 166.168L182.392 146.088L170.316 102Z"
          fill="url(#paint0_linear_0_1)"
        />
      </G>
      <G filter="url(#filter1_f_0_1)">
        <Path
          d="M89.9978 110.138L91.9686 110.171L105.152 117.156L123.631 123.543L143.964 125.962L139.543 188.31L125.918 248.496L97.5 270L78 256L67 243L56.5 230L51.3127 216.339L50 199L54.6811 190.825L71.3365 173.004L85.6928 153.276L89.9978 110.138Z"
          fill="url(#paint1_linear_0_1)"
        />
      </G>
      <Circle cx="137.5" cy="67.5" r="67.5" fill="url(#paint2_radial_0_1)" />
      <Circle cx="137.5" cy="67.5" r="67.5" fill="url(#paint3_linear_0_1)" fill-opacity="0.2" />
      <Circle cx="137.5" cy="67.5" r="67.5" fill="url(#paint4_linear_0_1)" fill-opacity="0.2" />
      <Circle cx="137.5" cy="67.5" r="67.5" fill="url(#paint5_linear_0_1)" fill-opacity="0.2" />
      <Defs>
        <Filter id="filter0_f_0_1" x="70" y="52" width="203.133" height="247" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_0_1" />
        </Filter>
        <Filter id="filter1_f_0_1" x="0" y="60.1382" width="193.964" height="259.862" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <FeGaussianBlur stdDeviation="25" result="effect1_foregroundBlur_0_1" />
        </Filter>
        <LinearGradient id="paint0_linear_0_1" x1="124.639" y1="167.012" x2="248.729" y2="167.012" gradientUnits="userSpaceOnUse">
          <Stop stop-color="#165B08" />
          <Stop offset="1" stop-color="#074E07" />
        </LinearGradient>
        <LinearGradient id="paint1_linear_0_1" x1="147.505" y1="175.295" x2="27.8284" y2="154.165" gradientUnits="userSpaceOnUse">
          <Stop stop-color="#C5FEC0" />
          <Stop offset="1" stop-color="#2ED934" />
        </LinearGradient>
        <RadialGradient
          id="paint2_radial_0_1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(111 35) rotate(50.2418) scale(154.797)"
        >
          <Stop stop-color="#CCFFD3" />
          <Stop offset="0.25" stop-color="#88F68C" />
          <Stop offset="0.5" stop-color="#0A9C0F" />
          <Stop offset="0.607546" stop-color="#0A9C0F" />
        </RadialGradient>
        <LinearGradient id="paint3_linear_0_1" x1="137" y1="96" x2="137.5" y2="135" gradientUnits="userSpaceOnUse">
          <Stop stop-color="#A26B6B" stop-opacity="0" />
          <Stop offset="0.524038" />
        </LinearGradient>
        <LinearGradient id="paint4_linear_0_1" x1="137" y1="88.5" x2="130.5" y2="129" gradientUnits="userSpaceOnUse">
          <Stop stop-opacity="0" />
          <Stop offset="0.572115" />
        </LinearGradient>
        <LinearGradient id="paint5_linear_0_1" x1="151" y1="83.5" x2="161" y2="135" gradientUnits="userSpaceOnUse">
          <Stop stop-opacity="0" />
          <Stop offset="0.454232" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
