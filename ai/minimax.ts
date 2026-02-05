
import { Board, PieceColor, Move } from '../types';
import { getValidMoves, applyMove, isKingInCheck } from '../gameLogic';
import { evaluateBoard } from './evaluator';

export const alphaBeta = (
  board: Board, 
  depth: number, 
  alpha: number, 
  beta: number, 
  maximizingPlayer: boolean,
  playerColor: PieceColor,
  opponentColor: PieceColor
): number => {
  if (depth === 0) {
    return evaluateBoard(board, playerColor);
  }

  const currentPlayer = maximizingPlayer ? playerColor : opponentColor;
  const moves = getValidMoves(board, currentPlayer);

  // Checkmate / Stalemate detection at leaf
  if (moves.length === 0) {
      if (isKingInCheck(board, currentPlayer)) {
          // Checkmate: If maximizing player is mated, return terrible score. 
          return maximizingPlayer ? -999999 : 999999;
      } else {
          // Stalemate
          return 0;
      }
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = applyMove(board, move);
      const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, false, playerColor, opponentColor);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = applyMove(board, move);
      const evalScore = alphaBeta(newBoard, depth - 1, alpha, beta, true, playerColor, opponentColor);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

/**
 * Searches for the best move with a given depth.
 */
export const searchBestMove = (board: Board, player: PieceColor, depth: number): Move | null => {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  const opponent = player === 'w' ? 'b' : 'w';
  let bestMove = moves[0];
  let maxEval = -Infinity;

  // Simple move ordering: captures first could be added here for optimization
  
  for (const move of moves) {
    const newBoard = applyMove(board, move);
    // Note: AI is usually Black ('b'). If player='b', maximizingPlayer=false in recursion if we called from root? 
    // No, standard Minimax: Root is maximizer.
    const evalScore = alphaBeta(newBoard, depth - 1, -Infinity, Infinity, false, player, opponent);
    
    // Add randomness for equal moves
    if (evalScore > maxEval) {
      maxEval = evalScore;
      bestMove = move;
    } else if (evalScore === maxEval && Math.random() > 0.5) {
        bestMove = move;
    }
  }

  return bestMove;
};
