export interface BoardState {
  _boardArr: [
    [
      {
        _positionX: 0;
        _positionY: 0;
        _occupied: false;
        _value: "";
        _isWinning: false;
      }
    ]
  ];
}

export interface Move {
  xCoordinate: number;
  yCoordinate: number;
  marker: string;
}

export interface MoveRequest {
  move: Move;
  boardState: BoardState;
  roomNumber: number;
}
