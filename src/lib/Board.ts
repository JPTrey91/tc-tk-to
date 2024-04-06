import type { BoardState } from "./Interfaces";
import Slot, { SlotValues } from "./Slot";

class Board {
  private _boardArr: Slot[][];
  private _turnCount: number;
  private _boardWidth: number;
  private _boardHeight: number;
  private _winner: SlotValues | null;
  private _isDraw: boolean;

  public constructor() {
    this._boardArr = [];
    this._turnCount = 1;
    this._winner = null;
    this._isDraw = false;
    this._boardWidth = parseInt(import.meta.env.VITE_BOARD_WIDTH ?? 3);
    this._boardHeight = parseInt(import.meta.env.VITE_BOARD_HEIGHT ?? 3);

    for (let x = 0; x < this._boardWidth; x++) {
      this._boardArr[x] = [];
      for (let y = 0; y < this._boardHeight; y++) {
        this._boardArr[x][y] = new Slot(x, y, false, SlotValues.empty);
      }
    }
  }

  static createBoardFromBoardState(boardState: BoardState): Board {
    const board = new Board();
    boardState._boardArr.map((row, rowIndex) => {
      row.map((slot, slotIndex) => {
        if (slot._occupied) {
          board.markSlotWithCoordinates(
            rowIndex,
            slotIndex,
            slot._value as SlotValues
          );
        }
      });
    });

    return board;
  }

  public getBoard(): Slot[][] {
    return this._boardArr;
  }

  public getBoardDimensions(): { x: number; y: number } {
    return { x: this._boardWidth, y: this._boardHeight };
  }

  public getCurrentPlayerMark(): SlotValues {
    return this._turnCount % 2 ? SlotValues.x : SlotValues.o;
  }

  public isOutOfMoves(): boolean {
    return this._turnCount > this._boardWidth * this._boardHeight;
  }

  public getWinner(): SlotValues | null {
    return this._winner;
  }

  private setWinner(winner: SlotValues) {
    this._winner = winner;
    if (winner === SlotValues.empty) {
      this._isDraw = true;
    }
  }

  private hasSameMark(slotA: Slot, slotB: Slot, slotC?: Slot): boolean {
    if (slotC) {
      return this.hasSameMark(slotA, slotB) && this.hasSameMark(slotB, slotC);
    }
    return slotA.isMarked && slotB.isMarked && slotA.value === slotB.value;
  }

  refresh(): Board {
    return this;
  }

  getSlot(xCoordinate: number, yCoordinate: number): Slot {
    return this._boardArr[xCoordinate][yCoordinate];
  }

  isSlotEmpty(xCoordinate: number, yCoordinate: number) {
    const slot = this.getSlot(xCoordinate, yCoordinate);
    return slot.isMarked;
  }

  markSlot(slot: Slot, forcedMark?: SlotValues): void {
    const marking = forcedMark ?? this.getCurrentPlayerMark();

    if (!slot.isMarked) {
      this._boardArr[slot.positionX][slot.positionY].mark(marking);
      this.incrementTurn();
      this.isGameOver();
    }
  }

  markSlotWithCoordinates(
    xCoordinate: number,
    yCoordinate: number,
    forcedMark?: SlotValues
  ) {
    const slot: Slot = this.getSlot(xCoordinate, yCoordinate);
    this.markSlot(slot, forcedMark);
  }

  incrementTurn(): void {
    this._turnCount++;
  }

  isGameOver(): boolean {
    const minimumMoves = this._boardWidth + this._boardHeight - 1;
    const maximumMoves = this._boardWidth * this._boardHeight;

    if (this._turnCount < minimumMoves) {
      return false;
    }

    if (this._turnCount > maximumMoves) {
      this.setWinner(SlotValues.empty);
      return true;
    }

    let isGameOver = false;

    // check horizontal
    for (let x = 0; x < this._boardWidth; x++) {
      if (
        this.hasSameMark(
          this._boardArr[x][0],
          this._boardArr[x][1],
          this._boardArr[x][2]
        )
      ) {
        this.markWinningSlots([x], [0, 1, 2]);
        this.setWinner(this._boardArr[x][0].value);
        isGameOver = true;
      }
    }

    // check vertical
    for (let y = 0; y < this._boardWidth; y++) {
      if (
        this.hasSameMark(
          this._boardArr[0][y],
          this._boardArr[1][y],
          this._boardArr[2][y]
        )
      ) {
        this.markWinningSlots([0, 1, 2], [y]);
        this.setWinner(this._boardArr[0][y].value);
        isGameOver = true;
      }
    }

    // check diagonals
    if (
      this.hasSameMark(
        this._boardArr[0][0],
        this._boardArr[1][1],
        this._boardArr[2][2]
      )
    ) {
      this.markWinningSlots([0, 1, 2], [0, 1, 2]);
      this.setWinner(this._boardArr[1][1].value);
      isGameOver = true;
    }

    if (
      this.hasSameMark(
        this._boardArr[2][0],
        this._boardArr[1][1],
        this._boardArr[0][2]
      )
    ) {
      this.markWinningSlots([2, 1, 0], [0, 1, 2]);
      this.setWinner(this._boardArr[1][1].value);
      isGameOver = true;
    }

    return isGameOver;
  }

  public isGameDrawn(): boolean {
    return this._isDraw;
  }

  private markWinningSlots(winningRows: number[], winningCols: number[]): void {
    // if: this is a many-to-many associating, then: this is a diagonal victory
    if (winningRows.length === winningCols.length) {
      for (let i = 0; i < winningRows.length; i++) {
        const slotRow = winningRows[i];
        const slotCol = winningCols[i];
        this._boardArr[slotRow][slotCol].isWinning = true;
      }
    }

    // else: this is a one-to-many pairing i.e. a vertical or horizontal victory
    else {
      winningRows.forEach((row) => {
        winningCols.forEach((col) => {
          this._boardArr[row][col].isWinning = true;
        });
      });
    }
  }

  getTurnCount(): number {
    return this._turnCount;
  }
}

export default Board;
