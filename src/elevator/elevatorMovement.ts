import { Direction } from '../types/direction';
import { Elevator } from './elevator';
import { processRequests } from './elevatorRequests';

export async function moveToFloor(elevator: Elevator, floor: number, direction?: Direction): Promise<void> {
  console.log(`Elevator moving to floor ${floor}`);

  const startFloor = elevator.getCurrentFloor();

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      elevator.currentFloor = floor;
      console.log(`Elevator arrived at floor ${floor}`);
      resolve();
    }, Math.abs(startFloor - floor) * 1000); // Simulated time based on floor difference
  });

  processRequests(elevator); // Continue processing requests after arrival
}

export function goToIdleFloor(elevator: Elevator): void {
  console.log(`Elevator is idle, moving to idle floor ${elevator.idleFloor}`);
  moveToFloor(elevator, elevator.idleFloor);
}
