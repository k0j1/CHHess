
import { Board, PieceColor, PieceType, WHITE, BLACK } from '../types';
import { BOARD_SIZE } from '../gameLogic';

// Material Value
const PIECE_VALUES: Record<PieceType, number> = {
    'p': 100,
    'n': 320,
    'b': 330,
    'r': 500,
    'q': 900,
    'k': 20000
};

// Simplified Position Tables (Bonus for better positions)
// Values are for White perspective. Flip rows for Black.
const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const getPositionBonus = (type: PieceType, r: number, c: number, color: PieceColor): number => {
    // Basic Tables
    let bonus = 0;
    // Normalize row for table lookup (0-7 perspective of the player)
    const row = color === WHITE ? r : 7 - r;
    const col = c; // Symmetric tables assumed mostly

    if (type === 'p') bonus = PAWN_TABLE[7-row][col]; // Tables are defined top-down (0=rank 8) usually, adapting logic
    if (type === 'n') bonus = KNIGHT_TABLE[7-row][col];
    
    // Simple center control bonus for others
    if (type === 'q' || type === 'b') {
        if (row >= 3 && row <= 4 && col >= 2 && col <= 5) bonus += 10;
    }

    return bonus;
};


export const evaluateBoard = (board: Board, playerColor: PieceColor): number => {
    let score = 0;
    const opponentColor = playerColor === WHITE ? BLACK : WHITE;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (piece) {
                // Material Score
                let val = PIECE_VALUES[piece.type];
                
                // Position Bonus
                val += getPositionBonus(piece.type, r, c, piece.color);

                if (piece.color === playerColor) {
                    score += val;
                } else {
                    score -= val;
                }
            }
        }
    }
    return score;
};
