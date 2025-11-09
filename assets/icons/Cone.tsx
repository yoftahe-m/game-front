import * as React from 'react';
import Svg, { Polygon, Path } from 'react-native-svg';

export default function Cone({ width = 30, height = 30, color = 'red' }) {
  const colors: Record<string, string[]> = {
    red: ['#FF8A65', '#FF7043', '#FF5722'],
    green: ['#81C784', '#66BB6A', '#4CAF50'],
    yellow: ['#FFF176', '#FFEE58', '#FFEB3B'],
    blue: ['#64B5F6', '#42A5F5', '#2196F3'],
  };

  const [main, mid, dark] = colors[color] || colors.red;
  const stroke = '#000000';
  const strokeWidth = 6;

  return (
    <Svg width={width} height={height} viewBox="0 0 512 512">
      <Polygon
        fill={main}
        stroke={stroke}
        strokeWidth={strokeWidth}
        points="11.084,370.598 11.084,353.719 256.001,212.317 500.916,353.719 500.916,370.598 256.001,512"
      />
      <Path
        fill={mid}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="M382.247,336.943l-77.291-310.99h-0.009
        c-0.941-6.455-5.655-12.757-14.162-17.669
        c-19.131-11.045-50.435-11.045-69.566,0
        c-8.507,4.912-13.222,11.214-14.162,17.669h-0.009
        l-77.292,310.99c-9.104,24.084,2.475,50.31,34.74,68.938
        c50.328,29.057,132.683,29.057,183.012,0
        C379.77,387.253,391.35,361.026,382.247,336.943z"
      />
      <Polygon
        fill={mid}
        stroke={stroke}
        strokeWidth={strokeWidth}
        points="256.001,495.121 256.001,512 11.084,370.598 11.084,353.719"
      />
      <Polygon
        fill={dark}
        stroke={stroke}
        strokeWidth={strokeWidth}
        points="256.001,495.121 256.001,512 500.916,370.598 500.916,353.719"
      />
      <Path
        fill={main}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="M221.218,48.448c-19.131-11.045-19.131-29.119,0-40.164s50.435-11.045,69.566,0
        c19.131,11.045,19.131,29.119,0,40.164
        C271.653,59.493,240.348,59.493,221.218,48.448z"
      />
      <Path
        fill={dark}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="M235.13,40.415c-11.478-6.627-11.478-17.471,0-24.098s30.261-6.627,41.74,0
        c11.478,6.627,11.478,17.471,0,24.098
        S246.609,47.042,235.13,40.415z"
      />
      <Path
        fill="#E0E0E2"
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="M362.967,259.374l-26.3-105.819c-3.277,2.736-7.004,5.342-11.215,7.773
        c-38.2,22.054-100.708,22.054-138.907,0
        c-4.211-2.431-7.937-5.037-11.215-7.774l0,0l-26.3,105.819
        c5.071,5.56,11.202,10.804,18.412,15.594
        c48.705,32.36,128.406,32.36,177.111,0
        C351.765,270.178,357.898,264.933,362.967,259.374z"
      />
    </Svg>
  );
}
