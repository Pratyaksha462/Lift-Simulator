// Select buttons, lift elements, and floor elements
let buttons = document.querySelectorAll(".call-lift-btn");
const addLiftBtn = document.querySelector(".add-lift-btn");
const addFloorBtn = document.querySelector(".add-floor-btn");
let liftEls = document.querySelectorAll(".lift-container");
let leftDoors = document.querySelectorAll(".left-door");
let rightDoors = document.querySelectorAll(".right-door");
const floorsContainer = document.querySelector(".floors");
let floors = document.querySelectorAll(".floor");
let requestedFloors = {};  // Add this line to track active floor requests

// Queue class to handle the list of lift requests
class Queue {
  constructor() {
    this.items = [];
  }

  // Add a request to the queue
  enqueue(element) {
    return this.items.push(element);
  }

  // Remove the first request from the queue
  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  // Get the most recent request without removing it
  peek() {
    return this.items[this.items.length - 1];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length == 0;
  }

  // Get the size of the queue
  size() {
    return this.items.length;
  }

  // Clear all requests in the queue
  clear() {
    this.items = [];
  }
}

/**
 * LIFT Management
 * - get available lifts
 * - find closest available lift
 * - add new lift
 */

// Create an array of lift objects containing each lift's DOM element, busy status, and current floor
const lifts = Array.from(document.querySelectorAll(".lift-container"), (el) => ({
  htmlEl: el,
  busy: false,
  currFloor: 0,
}));

// Get all lift objects
function getLifts() {
  return lifts;
}

// Find the closest available (not busy) lift to the destination floor
function getClosestEmptyLift(destFloor) {
  const lifts = getLifts();

  // Filter lifts that are not busy
  const emptyLifts = lifts.reduce(
    (result, value, i) =>
      result.concat(
        value.busy === false
          ? {
              i,
              currFloor: value.currFloor,
              distance: Math.abs(destFloor - value.currFloor), // Calculate distance to destination floor
            }
          : []
      ),
    []
  );

  // If no empty lifts, return an empty object and invalid index
  if (emptyLifts.length <= 0) {
    return { lift: {}, index: -1 };
  }

  // Find the closest lift based on the minimum distance to the destination
  const closestLift = emptyLifts.reduce((result, value, index) =>
    value.distance < result.distance ? value : result
  );

  const index = closestLift.i;

  return { lift: lifts[index], index };
}

// Calculate the maximum number of lifts that can fit based on viewport width
const getMaxLifts = () => {
  const viewportwidth = document.getElementsByTagName("body")[0].clientWidth;
  return Math.floor(((viewportwidth - 100)/120)); // Each lift takes 120px width with some padding
};

// // Call a lift to the requested floor
// const callLift = () => {
//   const { lift, index } = getClosestEmptyLift(requests.peek());

//   if (index >= 0) {
//     lifts[index].busy = true; // Mark lift as busy
//     moveLift(lift.htmlEl, requests.dequeue(), index); // Move the lift to the requested floor
//   }
// };
const callLift = () => {
  const { lift, index } = getClosestEmptyLift(requests.peek());

  if (index >= 0) {
    lifts[index].busy = true;
    const requestedFloor = requests.dequeue();
    moveLift(lift.htmlEl, requestedFloor, index);
    requestedFloors[requestedFloor] = false;  // Reset floor request after assigning a lift
  }
};


/**
 * LIFT ACTIONS -> animations: open, close, move up, down.
 */

// Open the lift doors
const openLift = (index) => {
  buttons.disabled = true;
  rightDoors[index].classList.add("right-door-open");
  leftDoors[index].classList.add("left-door-open");

  rightDoors[index].classList.remove("right-door-close");
  leftDoors[index].classList.remove("left-door-close");
};

// Close the lift doors
const closeLift = (index) => {
  rightDoors[index].classList.add("right-door-close");
  leftDoors[index].classList.add("left-door-close");

  rightDoors[index].classList.remove("right-door-open");
  leftDoors[index].classList.remove("left-door-open");
  buttons.disabled = false;

  // After doors close, mark the lift as idle after a delay
  setTimeout(() => {
    lifts[index].busy = false;
    dispatchliftIdle(); // Trigger 'liftIdle' event
  }, 2500);
};

// Automatically open and close lift doors with a delay in between
const openCloseLift = (index) => {
  openLift(index);
  setTimeout(() => {
    closeLift(index);
  }, 3000);
};

// Move the lift to the destination floor with a smooth animation
const moveLift = (lift, destFloor, index) => {
  const distance = Math.abs(destFloor - lifts[index].currFloor);
  lift.style.transform = `translateY(${destFloor * 100 * -1}%)`;
  lift.style.transition = `transform ${1500 * distance}ms ease-in-out`; // Speed is proportional to distance

  // Once the lift reaches the floor, open and close the doors
  setTimeout(() => {
    openCloseLift(index);
  }, distance * 1500 + 1000); // Account for the movement time

  lifts[index].currFloor = destFloor; // Update current floor of the lift
};

/**
 * REQUESTS -> addRequest and removeRequest functions
 */

// Add a floor request to the queue
// function addRequest(destFloor) {
//   requests.enqueue(destFloor);
//   dispatchRequestAdded(); // Trigger 'requestAdded' event
// }
function addRequest(destFloor) {
  if (!requestedFloors[destFloor]) {  // Only enqueue if no active request for the floor
    requests.enqueue(destFloor);
    requestedFloors[destFloor] = true;  // Mark the floor as requested
    dispatchRequestAdded();  // Trigger event
  }
}

// Remove the first request from the queue
function removeRequest() {
  requests.dequeue();
}

/**
 * EVENTS:
 * - requestAddedEvent: triggered when a new request is added
 * - liftIdleEvent: triggered when a lift becomes idle
 */

// Event to signal a new request was added
const requestAddedEvent = new Event("requestAdded");

// Event to signal a lift is idle and can accept new requests
const liftIdleEvent = new Event("liftIdle");

// Dispatch 'requestAdded' event
function dispatchRequestAdded() {
  document.dispatchEvent(requestAddedEvent);
}

// Dispatch 'liftIdle' event
function dispatchliftIdle() {
  document.dispatchEvent(liftIdleEvent);
}

// Listen for 'requestAdded' event and call a lift
document.addEventListener("requestAdded", () => {
  callLift();
});

// Listen for 'liftIdle' event and check if there are more requests
document.addEventListener("liftIdle", () => {
  if (!requests.isEmpty()) {
    callLift();
  }
});

/**
 * ADD DOM Elements -> addLift and addFloor functions
 */

// Add a new lift to the DOM and lift management system
function addLift() {
 // const liftsScrollContainer = document.querySelector(".lifts-scroll-container");
  floors[floors.length - 1].append(getLiftEl()); // Append lift to the last floor
  liftEls = document.querySelectorAll(".lift-container");
  lifts.push({
    htmlEl: liftEls[liftEls.length - 1],
    busy: false,
    currFloor: 0,
  });
  leftDoors = document.querySelectorAll(".left-door");
  rightDoors = document.querySelectorAll(".right-door");

  // Disable adding more lifts if max limit is reached
  // if(lifts.length >= getMaxLifts()) {
  //   console.log("Max lifts added");
  //   addLiftBtn.disabled = true;
  //   addLiftBtn.textContent = "Max lifts added";
  //   return;
  // }
}
// function addLift() {
//   const liftsScrollContainer = document.querySelector(".lifts-scroll-container");
//   const newLift = getLiftEl();  // Create a new lift element
//   liftsScrollContainer.append(newLift);  // Append lift to the scroll container

//   liftEls = document.querySelectorAll(".lift-container");  // Update the list of lift elements
//   lifts.push({
//     htmlEl: liftEls[liftEls.length - 1],
//     busy: false,
//     currFloor: 0,
//   });
//   leftDoors = document.querySelectorAll(".left-door");
//   rightDoors = document.querySelectorAll(".right-door");
// }

// Create a new lift element
function getLiftEl() {
  const liftDistance = (lifts.length + 1) * 120;

  const liftEL = document.createElement("div");
  liftEL.classList.add("lift-container");
  liftEL.style.position = "absolute";
  liftEL.style.left = `${liftDistance}px`;

  liftEL.innerHTML += `
            <div class="left-door"></div>
            <div class="right-door"></div>
        `;

  return liftEL;
}


// Add a new floor to the DOM
function addFloor() {
  floorsContainer.prepend(getFloorEl()); // Add the new floor to the top
  floors = document.querySelectorAll(".floor");
  buttons = document.querySelectorAll(".call-lift-btn");
  addCallLiftListeners([buttons[0], buttons[1]]); // Add listeners to the buttons on the new floor
}

// Create a new floor element with lift call buttons
function getFloorEl() {
  const newLiftNum = floors.length;

  const floorEl = document.createElement("div");
  floorEl.classList.add("floor");
  floorEl.innerHTML += `
                  <div class="lift-buttons">
                      <button class="call-lift-btn open-lift-btn" data-lift-num="${newLiftNum}">
                          <i class="fa-solid fa-angle-up"></i>
                      </button>
                      <button class="call-lift-btn close-lift-btn" data-lift-num="${newLiftNum}">
                          <i class="fa-solid fa-angle-down"></i>
                      </button>
                  </div>
                `;
  return floorEl;
}

// Add event listeners to lift call buttons
function addCallLiftListeners(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      addRequest(buttons[i].dataset.liftNum); // Add request to queue when button is clicked
    });
  }
}

/**
 * MAIN function to initialize the lift system
 */

// Initialize request queue and event listeners
let requests = new Queue();

function main() {
    addCallLiftListeners(buttons);
    addFloorBtn.addEventListener("click", addFloor);
    addLiftBtn.addEventListener("click", addLift);
  }
  
  main();