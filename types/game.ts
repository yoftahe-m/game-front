export interface Game {
  id: string;
  type: string;
  status: 'waiting' | 'playing' | 'ended';
  options: { [key: string]: any };
  players: { userId: string; username: string; picture?: string; socketId: string; status: 'active' | 'inactive' }[];
  maxPlayers: number;
  winner: string | null;
  amount: number;
}
[];
