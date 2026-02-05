
import { Board, PieceColor, Level, Move } from '../types';
import { searchBestMove } from './minimax';

export const getBestMove = (board: Board, player: PieceColor, level: Level): Move | null => {
  // Chess is complex, deeper depths are exponentially slower.
  // JS in browser: Keep depth low.
  
  let depth = 2;
  switch (level) {
      case 1: depth = 1; break; // Very weak
      case 2: depth = 2; break; // Weak
      case 3: depth = 2; break; // Normal (maybe adds positional heuristics in evaluator better)
      case 4: depth = 3; break; // Hard
      case 5: depth = 3; break; // Expert (Standard minimax depth 3 is decent for browser)
      default: depth = 2;
  }
  
  return searchBestMove(board, player, depth);
};
