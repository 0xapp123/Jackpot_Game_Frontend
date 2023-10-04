export interface Player {
    player: string;
    amount: number;
}

export interface ChatType {
    user_name: string,
    message: string,
    timestamp: number
}

export interface ServerToClientEvents {
    startGame: (pda: string, endTimestamp: number, players: Player[], startTimeStamp?: number) => void;
    connectionUpdated: (counter: number) => void;
    newGameReady: (endTimestamp: number, players: Player[]) => void;
    endGame: (random: number) => void;
    notifyJoinedPlayers: (players: Player[]) => void;
    // checkAccount: (user: User) => void
    sendBangHistory: (gameHistory: any[]) => void;
    notifyPlayerWithdrawn: (players: Player[]) => void;
    currentPositionUpdated: (currentPosition: number) => void;
    endTimeUpdated: (pda: string, last_ts: number, players: Player[]) => void;
    gameEnded: (winner: {
        bet: number,
        payout: number,
        winner: string,
        resultHeight: number
    }) => void;
    chatUpdated: (
        msgs: ChatType[]
    ) => void;
    gameStarting: (
        isStarting: number
    ) => void;
    getWinners: (
        winners: any[]
    ) => void;
    heartbeat: (
        nowTimeStamp: number
    ) => void;

}

export interface ClientToServerEvents {

}
