
import { WHITE, BLACK, Level, FarcasterUser, PieceColor } from '../types';

type ScoreBoardProps = {
  scores: { black: number, white: number }; // In Chess this could be material score
  turn: PieceColor;
  gameOver: boolean;
  level: Level;
  user?: FarcasterUser;
};

export const ScoreBoard = ({ turn, gameOver, level, user }: ScoreBoardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 text-center w-full">
        <div className="flex gap-2 sm:gap-4 items-center bg-white p-2 sm:p-3 pr-4 pl-4 sm:pr-6 sm:pl-6 rounded-[2rem] shadow-sm border border-slate-200">
            {/* Player (White) */}
            <div className={`flex flex-col items-center transition-all duration-300 ${turn === WHITE ? 'scale-110 opacity-100' : 'opacity-60 scale-95'}`}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-100 shadow-md border-2 border-slate-300 flex items-center justify-center overflow-hidden">
                        {user?.pfpUrl ? (
                            <img src={user.pfpUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">♔</span>
                        )}
                    </div>
                    {turn === WHITE && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>}
                </div>
                <span className="text-xs font-bold text-slate-500 mt-1 max-w-[80px] truncate">
                    {user?.displayName || "YOU"}
                </span>
            </div>

            <div className="h-10 w-px bg-slate-200 mx-2 sm:mx-4"></div>

            {/* Status Text */}
            <div className="w-24 sm:w-32 text-center flex flex-col justify-center h-full">
                <span className={`text-sm font-black block uppercase tracking-wide ${turn === WHITE ? 'text-green-600' : 'text-orange-500'}`}>
                    {gameOver ? "GAME OVER" : turn === WHITE ? "YOUR TURN" : "AI THINKING"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 rounded-full px-2 py-0.5 mt-1 mx-auto">
                    Lv.{level} CHHESS
                </span>
            </div>

            <div className="h-10 w-px bg-slate-200 mx-2 sm:mx-4"></div>

            {/* AI (Black) */}
            <div className={`flex flex-col items-center transition-all duration-300 ${turn === BLACK ? 'scale-110 opacity-100' : 'opacity-60 scale-95'}`}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-800 shadow-md border-2 border-slate-600 flex items-center justify-center">
                        <span className="text-white text-2xl">♚</span>
                    </div>
                    {turn === BLACK && <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full animate-pulse"></div>}
                </div>
                <span className="text-xs font-bold text-slate-500 mt-1">CPU</span>
            </div>
        </div>
    </div>
  );
};
