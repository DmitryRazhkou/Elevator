import { Direction } from '../types/direction';
import { Request } from '../types/request';
import { Elevator } from './elevator';
import { moveToFloor, goToIdleFloor } from './elevatorMovement';
import { IDLE_TIMEOUT_MS } from '../constants';

export function processRequests(elevator: Elevator): void {
  if (elevator.requests.length === 0) {
    if (elevator.idleTimeout) {
      clearTimeout(elevator.idleTimeout);
    }
    elevator.idleTimeout = setTimeout(() => goToIdleFloor(elevator), IDLE_TIMEOUT_MS); // 2 minutes idle timeout
    return;
  }

  // Determine the next request to execute
  let nextRequest: Request | undefined = undefined;
  for (let i = 0; i < elevator.requests.length; i++) {
    const request = elevator.requests[i];
    if (shouldExecuteRequest(elevator, request)) {
      nextRequest = request;
      elevator.requests.splice(i, 1); // Remove the request from the array
      break;
    }
  }

  // Execute the next request if found
  if (nextRequest) {
    if (nextRequest.direction) {
      moveToFloor(elevator, nextRequest.floor, nextRequest.direction).then(() => {
        setCallButtonState(elevator, nextRequest.floor, nextRequest.direction, false);
      });
    } else {
      moveToFloor(elevator, nextRequest.floor).then(() => {
        setCallButtonState(elevator, nextRequest.floor, Direction.Up, false);
        setCallButtonState(elevator, nextRequest.floor, Direction.Down, false);
      });
    }
  }

  // Start idle timeout after processing all requests
  startIdleTimeout(elevator);
}

function shouldExecuteRequest(elevator: Elevator, request: Request): boolean {
  // Determine if the request should be executed based on elevator's current state
  if (request.direction === undefined) {
    return true; // Always execute floor selection requests
  }

  // Check if the elevator is already at the requested floor
  if (elevator.currentFloor === request.floor) {
    return true;
  }

  // Check if the elevator can move towards the requested floor in the requested direction
  if (request.direction === Direction.Up && elevator.currentFloor < request.floor) {
    return true;
  }
  if (request.direction === Direction.Down && elevator.currentFloor > request.floor) {
    return true;
  }

  return false;
}

function setCallButtonState(elevator: Elevator, floor: number, direction: Direction | undefined, state: boolean): void {
  if (elevator.callButtonStates[floor]) {
    if (direction === Direction.Up) {
      elevator.callButtonStates[floor].up = state;
    } else if (direction === Direction.Down) {
      elevator.callButtonStates[floor].down = state;
    }
  }
}

function startIdleTimeout(elevator: Elevator): void {
  elevator.idleTimeout = setTimeout(() => goToIdleFloor(elevator), IDLE_TIMEOUT_MS);
}
