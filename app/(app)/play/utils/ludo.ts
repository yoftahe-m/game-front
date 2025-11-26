import { Coordinate } from "../type/ludo";

export const isSamePos = (p1: Coordinate, p2: Coordinate) => p1.x === p2.x && p1.y === p2.y;