export enum SlotValues {
  empty = "",
  x = "X",
  o = "O",
}

export default class Slot {
  private _isWinning: boolean;

  constructor(
    private _positionX: number,
    private _positionY: number,
    private _occupied: boolean,
    private _value: SlotValues
  ) {
    this._isWinning = false;
  }

  mark(value: SlotValues) {
    if (!this._occupied) {
      this._value = value;
    }
    this._occupied = true;
  }

  get isMarked(): boolean {
    return this._occupied;
  }

  get isWinning(): boolean {
    return this._isWinning;
  }

  set isWinning(value: boolean) {
    if (!this._isWinning) {
      this._isWinning = value;
    }
  }

  get value(): SlotValues {
    return this._value;
  }

  get positionX(): number {
    return this._positionX;
  }

  get positionY(): number {
    return this._positionY;
  }
}
