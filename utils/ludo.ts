import { BaseColors } from '@/enum/ludo';
import { BASE_COLORS, CELL_DIMENSION } from '@/constants/ludo';

export const getStyleObject = (cellCountLengthwise: number, cellCountWidthwise: number, baseColor?: BaseColors): React.CSSProperties => ({
  backgroundColor: baseColor && getBaseHexColor(baseColor),
  height: cellCountWidthwise * CELL_DIMENSION,
  width: cellCountLengthwise * CELL_DIMENSION,
});

export const getBaseHexColor = (color: BaseColors) => BASE_COLORS[color];
