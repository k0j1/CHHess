
import { useState, useEffect, useCallback } from 'react';
import { Level, Board, PieceColor, Position, Move, WHITE, BLACK, FarcasterUser } from '../types';
import { createInitialBoard, getValidMoves, applyMove, getGameState, isKingInCheck } from '../gameLogic';
import { getBestMove } from '../ai';
import { useGameStats } from './useGameStats';

export const useGameLogic = (
    level: Level, 
    onError: (error: any) => void,
    user?: FarcasterUser, 
    connectedAddress: string | null = null
) => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [turn, setTurn] = useState<PieceColor>(WHITE); 
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'WIN' | 'LOSS' | 'DRAW' | null>(null);
  
  // Selection State
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  
  const [aiThinking, setAiThinking] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'info' | 'warn'} | null>(null);

  const handleShowToast = useCallback((msg: string, type: 'info' | 'warn') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Stats Hook Integration - We mock scores as material for compatibility or just 1-0
  // In Chess: Win = we pass score {black: 0, white: 1} etc so the winner logic works?
  // Let's adapt scores for useGameStats: White=Player(2), Black=AI(1).
  const mockScores = { 
      black: gameResult === 'LOSS' ? 2 : (gameResult === 'DRAW' ? 1 : 0), 
      white: gameResult === 'WIN' ? 2 : (gameResult === 'DRAW' ? 1 : 0) 
  };
  
  useGameStats(gameOver, level, mockScores, handleShowToast, onError, user, connectedAddress);

  // Check Game Over conditions
  useEffect(() => {
    if (gameOver) return;
    
    const state = getGameState(board, turn);
    if (state === 'CHECKMATE') {
        setGameOver(true);
        if (turn === BLACK) { // AI Mated
             setGameResult('WIN');
             handleShowToast("Checkmate! You Win!", 'info');
        } else {
             setGameResult('LOSS');
             handleShowToast("Checkmate! You Lost.", 'warn');
        }
    } else if (state === 'STALEMATE') {
        setGameOver(true);
        setGameResult('DRAW');
        handleShowToast("Stalemate! It's a Draw.", 'info');
    } else {
        // Check notification
        if (isKingInCheck(board, turn)) {
            handleShowToast("Check!", 'warn');
        }
    }

  }, [board, turn, gameOver]);

  // AI Turn
  useEffect(() => {
    if (turn === BLACK && !gameOver) {
      setAiThinking(true);
      // Small delay for UX
      const timer = setTimeout(() => {
          // Process in next tick to allow UI render
          setTimeout(() => {
            const move = getBestMove(board, BLACK, level);
            if (move) {
                executeMove(move);
            } else {
                // Should be caught by game state check, but just in case
                console.warn("AI has no moves but game not over?");
            }
            setAiThinking(false);
          }, 50);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, board, level]);

  const executeMove = (move: Move) => {
    const newBoard = applyMove(board, move);
    setBoard(newBoard);
    setLastMove(move);
    setTurn(turn === WHITE ? BLACK : WHITE);
    setSelectedPos(null);
    setValidMoves([]);
  };

  const handleSquareClick = (r: number, c: number) => {
    if (gameOver || turn !== WHITE || aiThinking) return;

    const clickedPiece = board[r][c];
    const isMyPiece = clickedPiece && clickedPiece.color === WHITE;

    // 1. If clicking a valid move target
    const move = validMoves.find(m => m.to.r === r && m.to.c === c);
    if (move) {
        // Execute Move
        // Check promotion? Simplified: Auto-promote to Queen for now to save UI complexity
        if (move.promotion) {
             move.promotion = 'q'; 
        }
        executeMove(move);
        return;
    }

    // 2. Select Piece
    if (isMyPiece) {
        if (selectedPos?.r === r && selectedPos?.c === c) {
            // Deselect
            setSelectedPos(null);
            setValidMoves([]);
        } else {
            // Select new
            setSelectedPos({ r, c });
            const moves = getValidMoves(board, WHITE);
            // Filter moves for this piece
            const pieceMoves = moves.filter(m => m.from.r === r && m.from.c === c);
            setValidMoves(pieceMoves);
        }
    } else {
        // Clicked empty or enemy without a valid move -> Deselect
        setSelectedPos(null);
        setValidMoves([]);
    }
  };

  return {
    board,
    turn,
    gameOver,
    scores: mockScores, // Pass mock scores for compatibility
    validMoves,
    aiThinking,
    lastMove,
    toast,
    handleSquareClick,
    selectedPos,
    gameResult
  };
};
