# Step 1: Setup the HTML Structure (DOM Creation)
Learning Topics:
1) HTML Basics: Elements, divs, buttons, input fields
2) CSS Basics: Styling the layout (floors, lifts)
Task:
3) Create a webpage with an input field to specify the number of floors and lifts.
4) Create the initial UI using HTML and CSS to represent the floors and lifts.
5) Each floor should have a "call" button.

Lifts should all be placed on the bottom-most floor.
Steps:
Create index.html and style.css files.
Define the structure: each floor is a div, and each lift is another div nested inside the floor div on the bottom floor.
Use CSS to make the lift look like a block, and the floors are vertically aligned.
Ensure all lifts are initialized on the bottom-most floor.
# Step 2: Add JavaScript for Dynamic DOM Creation
Learning Topics:
JavaScript Basics: DOM manipulation, event listeners, loops
JavaScript Functions: Writing reusable code for adding floors and lifts
Task:
Dynamically create the floors and lifts based on the user's input using JavaScript.
Attach event listeners to the floor buttons (for calling lifts).
Steps:
In a script.js file, write a function to create and display floors and lifts.
Use loops to create div elements for floors and lifts and append them to the DOM.
Add "call" buttons on each floor.
# Step 3: Moving a Single Lift Up and Down
Learning Topics:
CSS Transitions/Animations: Moving elements smoothly
JavaScript Event Handling: Capturing button clicks and triggering actions
Task:
Implement the logic to move only one lift at a time when a floor button is clicked.
For example, if a button on the 3rd floor is pressed, the lift should move up to the 3rd floor.
Only one lift should move at any given time.
Steps:
When a button is clicked, find the closest lift on the same or nearby floors.
Use CSS transitions to move the lift from one floor to another.
Write a function to handle lift movement (up and down).
Step 4: Moving Multiple Lifts
Learning Topics:
JavaScript Asynchronous Programming: setTimeout, managing multiple lift movements
Control Structures: Prioritizing which lift should move based on proximity
Task:
Implement the logic to handle multiple lifts moving independently.
If two or more floors are calling for lifts, each lift should move to its nearest call.
Manage conflicts by assigning the closest available lift to each call.
Steps:
Enhance the lift movement logic to check which lift is closer to the requested floor.
Use asynchronous JavaScript (setTimeout, requestAnimationFrame) to manage the lifts' independent movements.
Avoid conflicts where two lifts try to move to the same floor.
Step 5: Handling All Lifts Moving Simultaneously
Learning Topics:
JavaScript Promises/Callbacks: Managing asynchronous lift operations
Event Queue Management: Handling new button presses while lifts are moving
Task:
Implement logic to handle situations where all lifts are already moving but new floor buttons are pressed.
Create a queue for lift requests.
Once a lift becomes available, assign it to the next pending request.
Steps:
Create a queue system in JavaScript for floor requests when all lifts are busy.
Once a lift finishes its current movement, check if there are pending requests and assign the lift to the next one in the queue.
Step 6: Polish the UI and Add Edge Cases
Learning Topics:
UI/UX Design: Improving user experience
JavaScript Error Handling: Dealing with edge cases (e.g., all lifts are moving, or lifts are on the same floor)
Task:
Add visual feedback for users, such as lights for busy/available lifts.
Handle edge cases like:
What happens if the user presses a floor button repeatedly.
Lifts going to the same floor at the same time.
Polish the movement logic to make the lift's behavior more realistic.
Steps:
Use CSS to indicate if a lift is busy or idle.
Add checks in the JavaScript code to prevent lifts from being assigned the same floor at the same time.
Test different scenarios to ensure the lifts behave correctly.
Final Step: Optional Features (Bonus)
Learning Topics:
Advanced JavaScript Concepts: Event bubbling, debouncing
CSS Advanced Animations: Smooth transitions and enhanced UI
Task:
Implement optional features such as:
Speed variation based on the distance between floors.
Sound effects or indicators for floor arrival.
Limit the number of passengers per lift.
Roadmap Summary:
DOM Creation & Basic Layout: Learn HTML, CSS to set up the structure.
JavaScript DOM Manipulation: Dynamically create the floors and lifts based on input.
Single Lift Movement: Control one lift's movement using JavaScript.
Multiple Lift Movement: Handle multiple lifts moving independently.
Queue Management: Manage floor requests when all lifts are busy.
Edge Cases & Polishing: Handle edge cases, UI improvements, and more realistic lift behavior.