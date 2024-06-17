import { Elevator } from '../src/elevator/elevator';
import { Direction } from '../src/types/direction';

describe('Elevator', () => {
  let elevator: Elevator;

  beforeEach(() => {
    elevator = new Elevator();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should call elevator to a floor and check call button state', async () => {
    elevator.call(2, Direction.Up);
    expect(elevator.getCallButtonStateForSpecifiedFloor(2, Direction.Up)).toBe(true); // Checking the button state before the elevator arrives
    await jest.advanceTimersByTimeAsync(2100); // Wait for the elevator arrives
    
    expect(elevator.getCurrentFloor()).toBe(2); // Check current floor
    expect(elevator.getCallButtonStateForSpecifiedFloor(2, Direction.Up)).toBe(false); // Call button light should be off
  }, 3000);

  test('should select a floor from inside the elevator', async () => {
    elevator.selectFloor(5);
    await jest.advanceTimersByTimeAsync(5100); // Wait for the elevator arrives
    
    expect(elevator.getCurrentFloor()).toBe(5);
  }, 6000);

test('should go to idle floor after being idle', async () => {
    elevator.selectFloor(2);
    await jest.advanceTimersByTimeAsync(2100); // Wait for the elevator to reach floor 2

    expect(elevator.getCurrentFloor()).toBe(2); // Check current floor after selecting floor 2

    await jest.advanceTimersByTimeAsync(130000); // Wait for 2 minutes and 10 seconds total

    expect(elevator.getCurrentFloor()).toBe(4); // Check the idle floor
}, 135000); 

test('should handle multiple requests correctly with the same call direction', async () => {
    elevator.call(2, Direction.Up);
  
    await jest.advanceTimersByTimeAsync(2100); // Wait for the elevator arrives to 2th floor
    expect(elevator.getCurrentFloor()).toBe(2); // Check current floor
  
    elevator.selectFloor(7);
    elevator.call(4, Direction.Up);
  
    await jest.advanceTimersByTimeAsync(3000); // Wait for the elevator arrives to 4th floor
    expect(elevator.getCurrentFloor()).toBe(4); // Check current floor
  
    await jest.advanceTimersByTimeAsync(4000); // Wait for the elevator arrives to 7th floor
    expect(elevator.getCurrentFloor()).toBe(7);
  
    // Check button states
    expect(elevator.getCallButtonStateForSpecifiedFloor(0, Direction.Up)).toBe(false); // Button at ground floor should be off
    expect(elevator.getCallButtonStateForSpecifiedFloor(4, Direction.Up)).toBe(false); // Button at 4th floor should be off
  }, 15000);

  test('should handle multiple requests correctly with the opposite call direction', async () => {
    elevator.call(2, Direction.Up);
  
    await jest.advanceTimersByTimeAsync(2100); // Wait for the elevator to reach floor 2
    expect(elevator.getCurrentFloor()).toBe(2);
  
    elevator.selectFloor(7);
    elevator.call(3, Direction.Down);
  
    await jest.advanceTimersByTimeAsync(6000); // Wait time for elevator to handle requests
    expect(elevator.getCurrentFloor()).toBe(7); // Check that the elevator arrived at floor 7
  
    await jest.advanceTimersByTimeAsync(10000); // Wait for the elevator to move to idle floor
    expect(elevator.getCurrentFloor()).toBe(3); // Check that the elevator arrived at floor 3
  }, 20000);
});
