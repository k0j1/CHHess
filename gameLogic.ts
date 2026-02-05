
import { Board, Piece, PieceColor, PieceType, Position, Move, WHITE, BLACK } from './types';

export const BOARD_SIZE = 8;

// Initial Setup
export const createInitialBoard = (): Board => {
    const board: Board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

    const setupRow = (row: number, color: PieceColor, pieces: PieceType[]) => {
        pieces.forEach((type, col) => {
            board[row][col] = { type, color, hasMoved: false };
        });
    };

    const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    const pawnRow: PieceType[] = Array(8).fill('p');

    // White (Player) at bottom (row 6, 7)
    setupRow(7, WHITE, backRow);
    setupRow(6, WHITE, pawnRow);

    // Black (AI) at top (row 0, 1)
    setupRow(0, BLACK, backRow);
    setupRow(1, BLACK, pawnRow);

    return board;
};

// --- Move Validation Logic ---

const isValidPos = (r: number, c: number) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

const isOpponent = (p1: Piece | null, color: PieceColor) => p1 !== null && p1.color !== color;
const isEmpty = (p: Piece | null) => p === null;

// Get pseudo-legal moves (ignoring check)
export const getPseudoLegalMoves = (board: Board, color: PieceColor): Move[] => {
    const moves: Move[] = [];
    
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (piece && piece.color === color) {
                const pos = { r, c };
                switch (piece.type) {
                    case 'p': moves.push(...getPawnMoves(board, pos, color)); break;
                    case 'n': moves.push(...getKnightMoves(board, pos, color)); break;
                    case 'b': moves.push(...getSlidingMoves(board, pos, color, [[1,1],[1,-1],[-1,1],[-1,-1]])); break;
                    case 'r': moves.push(...getSlidingMoves(board, pos, color, [[1,0],[-1,0],[0,1],[0,-1]])); break;
                    case 'q': moves.push(...getSlidingMoves(board, pos, color, [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]])); break;
                    case 'k': moves.push(...getKingMoves(board, pos, color)); break;
                }
            }
        }
    }
    return moves;
};

// Check if King is under attack
export const isKingInCheck = (board: Board, kingColor: PieceColor): boolean => {
    // Find King
    let kingPos: Position | null = null;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const p = board[r][c];
            if (p && p.type === 'k' && p.color === kingColor) {
                kingPos = { r, c };
                break;
            }
        }
    }
    if (!kingPos) return true; // Should not happen unless king captured (bug)

    const opponentColor = kingColor === WHITE ? BLACK : WHITE;
    const opponentMoves = getPseudoLegalMoves(board, opponentColor);

    return opponentMoves.some(m => m.to.r === kingPos!.r && m.to.c === kingPos!.c);
};

// Get strictly legal moves (filtering out moves that leave king in check)
export const getValidMoves = (board: Board, color: PieceColor): Move[] => {
    const pseudoMoves = getPseudoLegalMoves(board, color);
    const legalMoves: Move[] = [];

    for (const move of pseudoMoves) {
        const newBoard = applyMove(board, move);
        if (!isKingInCheck(newBoard, color)) {
            legalMoves.push(move);
        }
    }
    return legalMoves;
};

// Apply move to a board and return new board (Pure function)
export const applyMove = (board: Board, move: Move): Board => {
    const newBoard = board.map(row => row.map(p => p ? { ...p } : null));
    const piece = newBoard[move.from.r][move.from.c];

    if (!piece) return newBoard; // Should not happen

    // Move piece
    newBoard[move.to.r][move.to.c] = piece;
    newBoard[move.from.r][move.from.c] = null;
    
    piece.hasMoved = true;

    // Promotion
    if (move.promotion) {
        piece.type = move.promotion;
    }

    // Castling (simplified: moves rook)
    // Note: AI logic currently generates basic moves, full castling support would need more complex state tracking
    
    return newBoard;
};

// --- Piece Specific Move Generators ---

const getPawnMoves = (board: Board, pos: Position, color: PieceColor): Move[] => {
    const moves: Move[] = [];
    const dir = color === WHITE ? -1 : 1;
    const startRow = color === WHITE ? 6 : 1;
    const promotionRow = color === WHITE ? 0 : 7;

    // Forward 1
    const f1 = { r: pos.r + dir, c: pos.c };
    if (isValidPos(f1.r, f1.c) && isEmpty(board[f1.r][f1.c])) {
        if (f1.r === promotionRow) {
            ['q', 'r', 'b', 'n'].forEach(type => {
                moves.push({ from: pos, to: f1, promotion: type as PieceType });
            });
        } else {
            moves.push({ from: pos, to: f1 });
             // Forward 2
            if (pos.r === startRow) {
                const f2 = { r: pos.r + (dir * 2), c: pos.c };
                if (isValidPos(f2.r, f2.c) && isEmpty(board[f2.r][f2.c])) {
                    moves.push({ from: pos, to: f2 });
                }
            }
        }
    }

    // Captures
    [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
        const cap = { r: pos.r + dr, c: pos.c + dc };
        if (isValidPos(cap.r, cap.c) && isOpponent(board[cap.r][cap.c], color)) {
             if (cap.r === promotionRow) {
                ['q', 'r', 'b', 'n'].forEach(type => {
                    moves.push({ from: pos, to: cap, promotion: type as PieceType });
                });
            } else {
                moves.push({ from: pos, to: cap });
            }
        }
    });

    return moves;
};

const getKnightMoves = (board: Board, pos: Position, color: PieceColor): Move[] => {
    const moves: Move[] = [];
    const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    
    deltas.forEach(([dr, dc]) => {
        const t = { r: pos.r + dr, c: pos.c + dc };
        if (isValidPos(t.r, t.c)) {
            const target = board[t.r][t.c];
            if (isEmpty(target) || isOpponent(target, color)) {
                moves.push({ from: pos, to: t });
            }
        }
    });
    return moves;
};

const getSlidingMoves = (board: Board, pos: Position, color: PieceColor, dirs: number[][]): Move[] => {
    const moves: Move[] = [];
    dirs.forEach(([dr, dc]) => {
        let r = pos.r + dr;
        let c = pos.c + dc;
        while (isValidPos(r, c)) {
            const target = board[r][c];
            if (isEmpty(target)) {
                moves.push({ from: pos, to: { r, c } });
            } else {
                if (isOpponent(target, color)) {
                    moves.push({ from: pos, to: { r, c } });
                }
                break; // Blocked
            }
            r += dr;
            c += dc;
        }
    });
    return moves;
};

const getKingMoves = (board: Board, pos: Position, color: PieceColor): Move[] => {
    const moves: Move[] = [];
    const deltas = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    deltas.forEach(([dr, dc]) => {
        const t = { r: pos.r + dr, c: pos.c + dc };
        if (isValidPos(t.r, t.c)) {
            const target = board[t.r][t.c];
            if (isEmpty(target) || isOpponent(target, color)) {
                moves.push({ from: pos, to: t });
            }
        }
    });
    return moves;
};

export const getGameState = (board: Board, turn: PieceColor): 'PLAYING' | 'CHECKMATE' | 'STALEMATE' => {
    const moves = getValidMoves(board, turn);
    if (moves.length === 0) {
        if (isKingInCheck(board, turn)) {
            return 'CHECKMATE';
        } else {
            return 'STALEMATE';
        }
    }
    return 'PLAYING';
};
