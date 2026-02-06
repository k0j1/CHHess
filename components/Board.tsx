
import { Board as BoardType, Position, Move, PieceType, PieceColor, WHITE } from '../types';

type BoardProps = {
  board: BoardType;
  validMoves: Move[];
  lastMove: Move | null;
  onSquareClick: (r: number, c: number) => void;
  selectedPos: Position | null;
  turn: PieceColor;
  gameOver: boolean;
};

// Unicode Chess Pieces
const PIECE_ICONS: Record<PieceColor, Record<PieceType, string>> = {
  'w': { 'k': '♔', 'q': '♕', 'r': '♖', 'b': '♗', 'n': '♘', 'p': '♙' },
  'b': { 'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟︎' }
};

export const Board = ({ board, validMoves, lastMove, onSquareClick, selectedPos, gameOver }: BoardProps) => {
  
  const getSquareColor = (r: number, c: number) => {
    return (r + c) % 2 === 0 ? 'bg-[#EBECD0]' : 'bg-[#779556]';
  };

  const isSelected = (r: number, c: number) => selectedPos?.r === r && selectedPos?.c === c;
  
  const getMoveTarget = (r: number, c: number) => {
      return validMoves.find(m => m.to.r === r && m.to.c === c);
  };

  const isLastMove = (r: number, c: number) => {
      if (!lastMove) return false;
      return (lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c);
  };

  return (
    <div className="relative group w-full px-0.5 sm:px-0 select-none">
        <div className="bg-slate-800 p-2 sm:p-3 rounded-[0.5rem] shadow-xl border-b-8 border-slate-900">
            <div className="grid grid-cols-8 gap-0 border-2 border-slate-600">
            {board.map((row, r) => (
                row.map((cell, c) => {
                const moveTarget = getMoveTarget(r, c);
                const selected = isSelected(r, c);
                const highlighted = isLastMove(r, c);
                
                return (
                    <div 
                        key={`${r}-${c}`} 
                        className={`
                            w-full aspect-square relative flex items-center justify-center
                            ${getSquareColor(r, c)}
                            ${selected ? '!bg-[#BACA44]' : ''}
                            ${highlighted ? '!bg-[#F5F682] opacity-90' : ''}
                            cursor-pointer
                        `}
                        onClick={() => !gameOver && onSquareClick(r, c)}
                    >
                        {/* Valid Move Indicator */}
                        {moveTarget && (
                            <div className={`
                                absolute z-10 rounded-full 
                                ${cell ? 'w-full h-full border-4 border-black/10 rounded-full' : 'w-1/3 h-1/3 bg-black/10'}
                            `}></div>
                        )}

                        {/* Piece */}
                        {cell && (
                            <span 
                                className={`
                                    text-4xl sm:text-5xl leading-none z-20 transition-transform duration-200
                                    ${cell.color === WHITE ? 'text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]' : 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'}
                                    ${selected ? 'scale-110 -translate-y-1' : ''}
                                `}
                                style={{
                                    fontFamily: '"Segoe UI Symbol", "Arial Unicode MS", sans-serif'
                                }}
                            >
                                {PIECE_ICONS[cell.color][cell.type]}
                            </span>
                        )}
                        
                        {/* Rank/File Labels for corners */}
                        {c === 0 && <span className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${((r+c)%2===0) ? 'text-[#779556]' : 'text-[#EBECD0]'}`}>{8-r}</span>}
                        {r === 7 && <span className={`absolute bottom-0 right-1 text-[10px] font-bold ${((r+c)%2===0) ? 'text-[#779556]' : 'text-[#EBECD0]'}`}>{String.fromCharCode(97+c)}</span>}
                    </div>
                );
                })
            ))}
            </div>
        </div>
    </div>
  );
};
