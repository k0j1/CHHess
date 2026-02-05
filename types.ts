
export const WHITE = 'w'; // Player (先手)
export const BLACK = 'b'; // AI (後手) - Usually White starts in Chess, but keeping Player=White for consistency with standard chess perspective usually being at bottom
export const EMPTY = null;

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; // Pawn, Knight, Bishop, Rook, Queen, King
export type PieceColor = typeof WHITE | typeof BLACK;

export type Piece = {
    type: PieceType;
    color: PieceColor;
    hasMoved?: boolean; // For castling and pawn double move logic
};

export type Board = (Piece | null)[][];
export type Level = 1 | 2 | 3 | 4 | 5;

export type Position = { r: number, c: number };

export type Move = {
    from: Position;
    to: Position;
    promotion?: PieceType; // If pawn promotion
    isCastling?: boolean;
};

export type LevelStats = {
    win: number;
    loss: number;
    draw: number;
};

export type AppStats = {
    levels: Record<Level, LevelStats>;
    total: LevelStats;
    points: number;
    claimedScore?: number;
};

export type FarcasterUser = {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    custodyAddress?: string;
    verifiedAddresses?: string[];
};

export type LeaderboardEntry = {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    points: number;
};
