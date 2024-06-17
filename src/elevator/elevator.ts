// elevator.ts
import { Direction } from '../types/direction';
import { Request } from '../types/request';
import { IDLE_TIMEOUT_MS } from '../constants';
import { processRequests } from './elevatorRequests';
import { goToIdleFloor } from './elevatorMovement';

class Elevator {
  public currentFloor: number = 0;
  public requests: Request[] = [];
  public idleTimeout: NodeJS.Timeout | null = null;
  public callButtonStates: { [key: number]: { up: boolean; down: boolean } } = {};

  constructor(private readonly totalFloors: number = 7, public readonly idleFloor: number = 4) {
    for (let i = 1; i <= this.totalFloors; i++) {
      this.callButtonStates[i] = { up: false, down: false };
    }

    // Start idle timeout when elevator is initialized
    this.startIdleTimeout();
  }

  public call(floor: number, direction: Direction): void {
    console.log(`Call received at floor ${floor} to go ${direction}`);
    this.requests.push({ floor, direction });
    this.setCallButtonState(floor, direction, true);
    processRequests(this);
  }

  public selectFloor(floor: number): void {
    console.log(`Floor ${floor} selected inside the elevator`);
    this.requests.push({ floor });
    processRequests(this);
  }

  public setCallButtonState(floor: number, direction: Direction, state: boolean): void {
    if (this.callButtonStates[floor]) {
      if (direction === Direction.Up) {
        this.callButtonStates[floor].up = state;
      } else if (direction === Direction.Down) {
        this.callButtonStates[floor].down = state;
      }
    }
  }

  public getCallButtonStateForSpecifiedFloor(floor: number, direction: Direction): boolean {
    if (this.callButtonStates[floor]) {
      if (direction === Direction.Up) {
        return this.callButtonStates[floor].up;
      } else if (direction === Direction.Down) {
        return this.callButtonStates[floor].down;
      }
    }
    return false; // Default to false if floor or direction is invalid
  }

  public getCurrentFloor(): number {
    return this.currentFloor;
  }

  private startIdleTimeout(): void {
    this.idleTimeout = setTimeout(() => goToIdleFloor(this), IDLE_TIMEOUT_MS);
  }
}

export { Elevator, Request };
